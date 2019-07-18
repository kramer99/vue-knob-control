<template>
    <div class="knob-control" :style="style">
        <svg :width="computedSize" :height="computedSize" viewBox="0 0 100 100"
            @click="onClick"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd">
            <path
              :d="rangePath"
              :stroke-width="strokeWidth"
              :stroke="secondaryColor"
              class="knob-control__range">
            </path>
            <path
              v-if="showValue"
              :d="valuePath"
              :stroke-width="strokeWidth"
              :stroke="primaryColor"
              ref="path-value"
              :data-dash="length"
              :style="dashStyle"
              class="knob-control__value">
            </path>
            <text
              v-if="showValue"
              :x="50"
              :y="57"
              text-anchor="middle"
              :fill="textColor"
              class="knob-control__text-display">
              {{valueDisplay}}
            </text>
        </svg>
    </div>
</template>

<script>
    const RADIUS = 40;
    const MID_X = 50;
    const MID_Y = 50;
    const MIN_RADIANS = 4 * Math.PI / 3;
    const MAX_RADIANS = -Math.PI / 3;

    // map a value (x) from one range (in min/max) onto another (out min/max)
    const mapRange = (x, inMin, inMax, outMin, outMax) => {
        return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };

    export default {
        data () {
            return {
                length: 0,
                animatedValue: 0,
                interval: null
            }
        },
        props: {
            'animation': {
                type: Object,
                default: () => {
                    return {
                        animated: false,
                        animateValue: false,
                        animationDuration: 2000,
                        animationFunction: 'ease-in-out',
                    }
                }
            },
            'value': {
                type: Number,
                required: true
            },
            'max': {
                type: Number,
                default: 100
            },
            'min': {
                type: Number,
                default: 0
            },
            'stepSize': {
                type: Number,
                default: 1
            },
            'disabled': {
                type: Boolean,
                default: false
            },
            'size': {
                type: Number,
                default: 100
            },
            'responsive': {
                type: Boolean,
                default: false
            },
            'primaryColor': {
                type: String,
                default: '#409eff'
            },
            'secondaryColor': {
                type: String,
                default: '#dcdfe6'
            },
            'textColor': {
                type: String,
                default: '#000000'
            },
            'strokeWidth': {
                type: Number,
                default: 17
            },
            'valueDisplayFunction': {
                type: Function,
                default: (v) => v
            },
        },
        computed: {
            dashStyle () {
                return {
                    strokeDasharray: this.length,
                    strokeDashoffset: this.length
                }
            },
            style () {
                return {
                    height: this.responsive ? this.size + '%' : this.size - 5 + 'px'
                };
            },
            computedSize () {
                return this.responsive ? this.size + '%' : this.size;
            },
            rangePath () {
                return `M ${this.minX} ${this.minY} A ${RADIUS} ${RADIUS} 0 1 1 ${this.maxX} ${this.maxY}`;
            },
            valuePath () {
                return `M ${this.zeroX} ${this.zeroY} A ${RADIUS} ${RADIUS} 0 ${this.largeArc} ${this.sweep} ${this.valueX} ${this.valueY}`;
            },
            showValue () {
                return (this.value >= this.min && this.value <= this.max) && !this.disabled;
            },
            zeroRadians () {
                /* this weird little bit of logic below is to handle the fact that usually we
                    want the value arc to start drawing from the 'zero' point, but, in the case
                    that the minimum and maximum values are both above zero, we set the 'zero point'
                    at the supplied minimum, so the value arc renders as the user would expect */
                if (this.min > 0 && this.max > 0)
                    return mapRange(this.min, this.min, this.max, MIN_RADIANS, MAX_RADIANS);
                else
                    return mapRange(0, this.min, this.max, MIN_RADIANS, MAX_RADIANS);
            },
            valueRadians () {
                return mapRange(this.value, this.min, this.max, MIN_RADIANS, MAX_RADIANS);
            },
            minX () {
                return MID_X + Math.cos(MIN_RADIANS) * RADIUS;
            },
            minY () {
                return MID_Y - Math.sin(MIN_RADIANS) * RADIUS;
            },
            maxX () {
                return MID_X + Math.cos(MAX_RADIANS) * RADIUS;
            },
            maxY () {
                return MID_Y - Math.sin(MAX_RADIANS) * RADIUS;
            },
            zeroX () {
                return MID_X + Math.cos(this.zeroRadians) * RADIUS;
            },
            zeroY () {
                return MID_Y - Math.sin(this.zeroRadians) * RADIUS;
            },
            valueX () {
                return MID_X + Math.cos(this.valueRadians) * RADIUS;
            },
            valueY () {
                return MID_Y - Math.sin(this.valueRadians) * RADIUS;
            },
            largeArc () {
                return Math.abs(this.zeroRadians - this.valueRadians) < Math.PI ? 0 : 1;
            },
            sweep () {
                return this.valueRadians > this.zeroRadians ? 0 : 1;
            },
            valueDisplay () {

                if (this.animation.animateValue) {

                    return this.animation.animateValue;

                } else {
                    
                    return this.value;

                }
            },
        },
        methods: {
            updatePosition (offsetX, offsetY) {



                const boundingClientRect = this.$el.getBoundingClientRect();

                //Calculating the positionning from client screen positioning. 
                //This avoids concflict of dom offsetX position from the event target.
                const dx = offsetX - (boundingClientRect.left+boundingClientRect.right)/2;
                const dy =  (boundingClientRect.top+boundingClientRect.bottom)/2 - offsetY;
                const angle = Math.atan2(dy, dx);

                let v;
                /* bit of weird looking logic to map the angles returned by Math.atan2() onto
                    our own unconventional coordinate system */
                const start = -Math.PI / 2 - Math.PI / 6;
                if (angle > MAX_RADIANS) {
                    v = mapRange(angle, MIN_RADIANS, MAX_RADIANS, this.min, this.max);
                } else if (angle < start) {
                    v = mapRange(angle + 2 * Math.PI, MIN_RADIANS, MAX_RADIANS, this.min, this.max);
                } else {
                    return;
                }

                let stepChunks = this.stepSize.toString().split();

                let decimalSize = stepChunks[1] != undefined ?  stepChunks[1].length : 0;
                //let numberSize = stepChunks[0] != undefined ?  stepChunks[0].length : 0;

      
                //Setting magnitude on base 10 for rounding. (10, 100, 1000) etc.
                let magnitude = Math.pow(10, decimalSize+1);
                
                //console.log(magnitude)   
                //console.log(v)        
                //console.trace()

                //You multiply the magnitude to set rounding then divide it back to normalize 
                let value = Math.round(v*magnitude)/magnitude

                //this.value = value;
                
                this.$emit('input', value);
            },
            onClick (e) {
                if (!this.disabled) {
                    this.updatePosition(e.clientX, e.clientY);
                }
            },
            onMouseDown (e) {
                if (!this.disabled) {
                    e.preventDefault();
                    window.addEventListener('mousemove', this.onMouseMove);
                    window.addEventListener('mouseup', this.onMouseUp);
                }
            },
            onMouseUp (e) {
                if (!this.disabled) {
                    e.preventDefault();
                    window.removeEventListener('mousemove', this.onMouseMove);
                    window.removeEventListener('mouseup', this.onMouseUp);
                }
            },
            onTouchStart (e) {
                if (!this.disabled) {
                    e.preventDefault();
                    window.addEventListener('touchmove', this.onTouchMove);
                    window.addEventListener('touchend', this.onTouchEnd);
                }
            },
            onTouchEnd (e) {
                if (!this.disabled) {
                    e.preventDefault();
                    window.removeEventListener('touchmove', this.onTouchMove);
                    window.removeEventListener('touchend', this.onTouchEnd);
                }
            },
            onMouseMove (e) {
                if (!this.disabled) {
                    e.preventDefault();
                    //console.log('mouse move');
                    this.updatePosition(e.clientX, e.clientY);
                }
            },
            onTouchMove (e) {

                //console.log('touch move');
                if (!this.disabled && e.touches.length == 1) {
                    const touch = e.targetTouches.item(0);
                    const offsetX = touch.clientX;
                    const offsetY = touch.clientY;
                    this.updatePosition(offsetX, offsetY);
                }
            },
            dashLength () {
                let element = this.$refs[ 'path-value' ]
                let length = element.getTotalLength()

                if (this.animation.animated) {
                    element.style.animationDuration = (this.animation.animationDuration / 1000) + 's'
                    element.style.animationFunction = this.animation.animationFunction
                }

                element.dataset.dash = length

                this.length = length
            }
        },
        mounted () {
            this.dashLength() // the element should be in the DOM

            clearInterval(this.interval)
            this.interval = null;

            if (this.animation.animateValue) {
                this.interval = setInterval(() => {
                    if (this.animatedValue < this.value) {
                        this.animatedValue += 1;
                    } else {
                        clearInterval(this.interval);
                        this.interval = null;
                    }

                }, ((this.animation.animationDuration * 1000) / this.value) / 1000);
            }
        }
    };
</script>

<style>
    @keyframes dash-frame {
        100% {
            stroke-dashoffset: 0;
        }
    }
    .knob-control__range {
        fill: none;
        transition: stroke .1s ease-in;
    }
    .knob-control__value {
        animation-name: dash-frame;
        animation-fill-mode: forwards;
        fill: none;
    }
    .knob-control__text-display {
        font-size: 1.3rem;
        text-align: center;
    }
</style>

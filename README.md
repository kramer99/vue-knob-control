# vue-knob-control
A rotary knob control for Vue.js

## Install
```shell
npm install vue-knob-control -S
```

## Usage

```javascript
import Vue from 'vue'
import VueKnobControl from 'vue-knob-control'

Vue.use(VueKnobControl)
```

## Examples

Most basic usage:
```html
<knob-control v-model="someValue"></knob-control>
```
<img width="105" alt="one" src="https://user-images.githubusercontent.com/6402557/39788944-c86fd9f2-52e1-11e8-91f1-cb89cec6bf77.png">

Specifying minimum and maximum values, note that the value arc is drawn from the calculated zero point. We have also made the arc appear thinner:
```html
<knob-control
  :min="-12"
  :max="12"
  :stroke-width="8"
  v-model="semitone"
></knob-control>
```
<img width="95" alt="two" src="https://user-images.githubusercontent.com/6402557/39788946-c8b784d2-52e1-11e8-9922-841bb6331d48.png">

Changing size and colors:
```html
<knob-control
  :min="-64"
  :max="63"
  :size="75"
  primary-color="#E844C3"
  secondary-color="#E7B6DC"
  text-color="#E844C3"
  v-model="detune"
></knob-control>
```
<img width="80" alt="three" src="https://user-images.githubusercontent.com/6402557/39788945-c88ae45e-52e1-11e8-98ec-f73600cc505d.png">

You can also pass a function to alter the value text displayed:
```javascript
toWord: function(val) {
    const map = {
        0: 'zero',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
    }
    return map[val];
}
```

```html
<knob-control
  :min="0"
  :max="4"
  :value-display-function="toWord"
  v-model="val"
></knob-control>
```
<img width="107" alt="four" src="https://user-images.githubusercontent.com/6402557/39789354-331a636a-52e4-11e8-9464-6627b3e11add.png">



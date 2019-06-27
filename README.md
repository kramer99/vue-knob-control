# vue-knob-control
A rotary knob control for Vue.js

## Install
```shell
npm install vue-knob-control -S
```

## Usage

```javascript
import Vue from 'vue'
import KnobControl from 'vue-knob-control'

Vue.use(KnobControl)
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

## Properties

The only required property is `value`.

Option | Type | Description | Default
-------|------|-------------|--------
value | Number | Use the `v-model` attribute to set the value of the control | none
max | Number | Maximum value of the control | 100
min | Number | Minimum value of the control | 0
stepSize | Number | Smallest increment the value can change by | 1
disabled | Boolean | Set to true to disable the knob | false
size | Number | Visual size of the control in `px` (or `%` if `responsive` is `true`) | 100
primaryColor | String | Color of the value arc | #409eff
secondaryColor | String | Color of the rest of the control | #dcdfe6
textColor | String | Color of the value text | #000000
strokeWidth | Number | Thickness of the arcs | 17
valueDisplayFunction | Function | Custom function to alter the display text | `(v) => v`
responsive | Boolean | Use `%` intead of `px` | false
allowOverSize |Boolean | If you want explicitly more than 100% in responsive mode. Else 100% is forced | false

/**
 * react-native-flip-toggle-button
 * A cross-platform customisable toggle button built upon react-native's TouchableOpacity and Animated APIs
 * https://github.com/ashishpandey001/react-native-flip-toggle-button
 * Email:hmaster0@gmail.com
 * @ashishpandey001
 */

 import React from 'react';
 import {
   Text,
   View,
   TouchableOpacity,
   Image,
   Animated,
   Easing
 } from 'react-native';
 
 import PropTypes from 'prop-types';
 
 const capitalize = require('lodash.capitalize');
 
 let toValue = 0
 let labelStyle = {}
 class FlipToggle extends React.Component {
   static propTypes = {
     value: PropTypes.bool.isRequired,
     disabled: PropTypes.bool,
     onLabel: PropTypes.string,
     offLabel: PropTypes.string,
     buttonOnColor: PropTypes.string,
     buttonOffColor: PropTypes.string,
     disabledButtonOnColor: PropTypes.string,
     disabledButtonOffColor: PropTypes.string,
     sliderOnColor: PropTypes.string,
     sliderOffColor: PropTypes.string,
     disabledSliderOnColor: PropTypes.string,
     disabledSliderOffColor: PropTypes.string,
     buttonWidth: PropTypes.number.isRequired,
     buttonHeight: PropTypes.number.isRequired,
     buttonRadius: PropTypes.number,
     sliderWidth: PropTypes.number,
     sliderHeight: PropTypes.number,
     sliderRadius: PropTypes.number,
     buttonPadding: PropTypes.number,
     margin: PropTypes.number,
     labelStyle: PropTypes.object,
     changeToggleStateOnLongPress: PropTypes.bool,
     onToggle: PropTypes.func.isRequired,
     onToggleLongPress: PropTypes.func
   };
 
   static defaultProps = {
     disabled: false,
     buttonOnColor: '#000',
     buttonOffColor: '#000',
     sliderOnColor: '#dba628',
     sliderOffColor: '#dba628',
     disabledButtonOnColor: '#666',
     disabledButtonOffColor: '#666',
     disabledSliderOnColor: '#444',
     disabledSliderOffColor: '#444',
     labelStyle: {},
     buttonRadius: 0,
     sliderRadius: 0,
     buttonPadding: 0,
     labelStyle: {
       color: 'white'
     },
     changeToggleStateOnLongPress: true,
   };
 
   constructor(props) {
     super(props);
     this.props = props;
     let labelStyle = {};
     if (!this.props.labelStyle.fontSize) {
       labelStyle = {
         ...this.props.labelStyle,
         fontSize: 0.1 * this.props.buttonWidth
       };
     } else {
       labelStyle = { ...this.props.labelStyle };
     }
     this.labelStyle = labelStyle;
     this.dimensions = this.calculateDimensions(this.props);
     this.offsetX = new Animated.Value(0);
     if (this.props.value) {
       const adjustment = this.props.buttonPadding - 2 // there's some extra space to the right which we remove here
       toValue = toValue = (this.dimensions.buttonWidth - adjustment) - this.dimensions.translateX;
     } else {
       toValue = 0;
     }
     Animated.timing(this.offsetX, {
       toValue: toValue,
       duration: 0,
       useNativeDriver: true,
     }).start();
   }
 
   componentDidUpdate(prevProps) {
     const { props: currentProps } = this;
     if (!currentProps.labelStyle.fontSize) {
       labelStyle = {
         ...currentProps.labelStyle,
         fontSize: 0.1 * currentProps.buttonWidth
       };
     } else {
       labelStyle = { ...currentProps.labelStyle };
     }
     this.labelStyle = labelStyle;
     this.dimensions = this.calculateDimensions(currentProps);
     if (currentProps.value) {
       const adjustment = this.props.buttonPadding - 2 // there's some extra space to the right which we remove here
       toValue = toValue = (this.dimensions.buttonWidth - adjustment) - this.dimensions.translateX;
     } else {
       toValue = 0;
     }
     Animated.timing(this.offsetX, {
       toValue: toValue,
       duration: 300,
       useNativeDriver: true,
     }).start();
   }
 
   calculateDimensions = (toggleProps) => {
     let sliderWidth = 0,
       sliderHeight = 0,
       sliderRadius = 0,
       margin = 0;
     if (!toggleProps.sliderWidth && !toggleProps.sliderHeight) {
       sliderWidth = sliderHeight = 0.9 * toggleProps.buttonHeight;
     } else if (!toggleProps.sliderHeight) {
       sliderWidth = toggleProps.sliderWidth;
       sliderHeight = 0.9 * toggleProps.buttonHeight;
     } else {
       sliderWidth = toggleProps.sliderWidth;
       sliderHeight = toggleProps.sliderHeight;
     }
     if (toggleProps.buttonRadius && !toggleProps.sliderRadius) {
       sliderRadius = toggleProps.buttonRadius;
     } else {
       sliderRadius = toggleProps.sliderRadius;
     }
     if (!toggleProps.margin) {
       margin = parseInt(0.02 * toggleProps.buttonWidth);
     }
     let dimensions = {
       buttonWidth: toggleProps.buttonWidth,
       buttonHeight: toggleProps.buttonHeight,
       buttonRadius: parseInt(
         toggleProps.buttonRadius / 100 * toggleProps.buttonWidth
       ),
       sliderWidth: sliderWidth,
       sliderHeight: sliderHeight,
       sliderRadius: parseInt(sliderRadius / 100 * sliderWidth),
       margin: margin,
       translateX: 2 * parseInt(margin) + sliderWidth
     };
     return dimensions;
   };
 
   toggleCommon = () => {
     return !this.props.value;
   };
 
   onTogglePress = () => {
     const newState = this.toggleCommon();
     this.props.onToggle(newState);
   };
 
   onToggleLongPress = () => {
     let newState = this.props.value;
     if (this.props.changeToggleStateOnLongPress) {
       newState = this.toggleCommon();
     }
     if (this.props.onToggleLongPress) {
       this.props.onToggleLongPress(newState);
     }
   };
 
   setBackgroundColor = component => {
     if (this.props.disabled && this.props.value) {
       let key = `disabled${capitalize(component)}OnColor`;
       let { [key]: data } = this.props;
       return data;
     } else if (this.props.disabled && !this.props.value) {
       let key = `disabled${capitalize(component)}OffColor`;
       let { [key]: data } = this.props;
       return data;
     } else if (this.props.value) {
       let key = `${component}OnColor`;
       let { [key]: data } = this.props;
       return data;
     } else {
       let key = `${component}OffColor`;
       let { [key]: data } = this.props;
       return data;
     }
   };
 
   render() {
     let ButtonComponent = this.props.buttonComponent || TouchableOpacity
     return (
       <View style={[styles.container]}>
         <ButtonComponent
           disabled={this.props.disabled}
           style={{
             justifyContent: 'center',
             borderRadius: this.dimensions.buttonRadius,
             height: this.dimensions.buttonHeight,
             width: this.dimensions.buttonWidth,
             backgroundColor: this.setBackgroundColor('button')
           }}
           activeOpacity={1}
           onPress={this.onTogglePress}
           onLongPress={this.onToggleLongPress}
         >
           {this.props.onLabel || this.props.offLabel ? (
             <Text style={[{ alignSelf: 'center' }, this.props.labelStyle]}>
               {this.props.value ? this.props.onLabel : this.props.offLabel}
             </Text>
           ) : null}
           <Animated.View
             style={{
               margin: this.dimensions.margin,
               transform: [{ translateX: this.offsetX }],
               position: 'absolute',
               width: this.dimensions.sliderWidth - this.props.buttonPadding,
               height: this.dimensions.sliderHeight - this.props.buttonPadding,
               marginLeft: this.props.buttonPadding,
               borderRadius: this.dimensions.sliderRadius * 2,
               justifyContent: 'center',
               alignItems: 'center',
               backgroundColor: this.setBackgroundColor('slider')
             }}
           >
             {this.props.nubText ? this.props.nubText : null}
           </Animated.View>
         </ButtonComponent>
       </View>
     );
   }
 }
 
 export default FlipToggle;
 
 const styles = {
   container: {
     flexDirection: 'row',
     alignItems: 'center'
   }
 };
 
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const sizes = {
  height: {
    _8: responsiveHeight(1.2),
    _16: responsiveHeight(2.0),
    _30: responsiveHeight(3.4),
  },

  imageHeight: {
    _20: responsiveHeight(20.0),
    _18: responsiveHeight(18.0),
    _16: responsiveHeight(16.0),
    _14: responsiveHeight(14.0),
    _12: responsiveHeight(12.0),
    _10: responsiveHeight(10.0),
  },
  text: {
    _14: responsiveFontSize(1.6),
    _16: responsiveFontSize(1.8),
    _18: responsiveFontSize(2.0),
    _20: responsiveFontSize(2.2),
    _22: responsiveFontSize(2.4),
  },
};

export const marginSizesHeight = sizes.height;
export const marginSizesWidth = sizes.height;

export const heightSize = sizes.imageHeight;

export const fontSizes = sizes.text;

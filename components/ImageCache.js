import React from'react';
import CachedImage from 'react-native-image-cache-wrapper';

export const ImageCache = props => <CachedImage {...props} source={props.source}/>

export const BgImageCache = props => <CachedImage {...props} source={props.source}>{props.children}</CachedImage>

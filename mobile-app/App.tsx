import React,{useEffect,useRef,useState} from 'react';
import {ActivityIndicator,BackHandler,Linking,SafeAreaView,StatusBar,StyleSheet,Text,View} from 'react-native';
import {WebView,WebViewNavigation} from 'react-native-webview';
import type {WebViewErrorEvent} from 'react-native-webview/lib/WebViewTypes';
import NativeApp from './NativeApp';

const SITE='https://gamerushiraq.github.io/gamerushiraq2027/';
const HOST='gamerushiraq.github.io';

export default function App(){
  const webRef=useRef<WebView>(null);
  const [failed,setFailed]=useState(false);
  const [loading,setLoading]=useState(true);
  const [canGoBack,setCanGoBack]=useState(false);

  useEffect(()=>{
    const sub=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(failed)return false;
      if(canGoBack){webRef.current?.goBack();return true;}
      return false;
    });
    return()=>sub.remove();
  },[canGoBack,failed]);

  const handleRequest=(request:any)=>{
    const url=String(request.url||'');
    if(url.startsWith('mailto:')||url.startsWith('tel:')||url.startsWith('whatsapp:')||url.startsWith('https://wa.me/')){
      Linking.openURL(url).catch(()=>{});
      return false;
    }
    if(url.startsWith('http://')||url.startsWith('https://')){
      try{
        const u=new URL(url);
        if(u.host===HOST)return true;
      }catch{}
      Linking.openURL(url).catch(()=>{});
      return false;
    }
    return true;
  };

  const onError=(event:WebViewErrorEvent)=>{
    if(event.nativeEvent.url?.includes(HOST))setFailed(true);
  };

  if(failed){
    return <NativeApp/>;
  }

  return <SafeAreaView style={s.safe}>
    <StatusBar barStyle="light-content" backgroundColor="#050810"/>
    {loading&&<View style={s.loader}><ActivityIndicator size="large" color="#b7ff2a"/><Text style={s.loaderText}>جاري فتح GameRush…</Text></View>}
    <WebView
      ref={webRef}
      source={{uri:SITE}}
      style={s.web}
      javaScriptEnabled
      domStorageEnabled
      cacheEnabled
      pullToRefreshEnabled
      startInLoadingState={false}
      originWhitelist={['https://*','http://*']}
      setSupportMultipleWindows={false}
      onLoadStart={()=>setLoading(true)}
      onLoadEnd={()=>setLoading(false)}
      onNavigationStateChange={(state:WebViewNavigation)=>setCanGoBack(state.canGoBack)}
      onShouldStartLoadWithRequest={handleRequest}
      onError={onError}
      onHttpError={(event)=>{if(event.nativeEvent.statusCode>=500)setFailed(true)}}
    />
  </SafeAreaView>;
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#050810'},
  web:{flex:1,backgroundColor:'#050810'},
  loader:{position:'absolute',zIndex:5,left:0,right:0,top:0,bottom:0,alignItems:'center',justifyContent:'center',backgroundColor:'#050810'},
  loaderText:{color:'#aeb9c9',fontSize:13,fontWeight:'800',marginTop:12}
});

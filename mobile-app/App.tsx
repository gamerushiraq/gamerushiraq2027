import React,{useRef,useState} from 'react';
import {ActivityIndicator,BackHandler,RefreshControl,SafeAreaView,StatusBar,StyleSheet,Text,View} from 'react-native';
import {WebView} from 'react-native-webview';

const WEB='https://gamerushiraq.github.io/gamerushiraq2027/';

export default function App(){
  const ref=useRef<WebView>(null);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState(false);

  React.useEffect(()=>{
    const sub=BackHandler.addEventListener('hardwareBackPress',()=>{
      ref.current?.goBack();
      return true;
    });
    return ()=>sub.remove();
  },[]);

  return <SafeAreaView style={s.safe}>
    <StatusBar barStyle="light-content" backgroundColor="#050810"/>
    <View style={s.wrap}>
      <WebView
        ref={ref}
        source={{uri:WEB}}
        style={s.web}
        originWhitelist={['https://*']}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        setSupportMultipleWindows={false}
        pullToRefreshEnabled
        onLoadStart={()=>{setLoading(true);setError(false)}}
        onLoadEnd={()=>{setLoading(false);setRefreshing(false)}}
        onError={()=>{setLoading(false);setRefreshing(false);setError(true)}}
        renderLoading={()=>null}
        startInLoadingState
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{setRefreshing(true);ref.current?.reload()}}
            tintColor="#b7ff2a"
          />
        }
      />
      {loading && <View pointerEvents="none" style={s.loader}><ActivityIndicator size="large" color="#b7ff2a"/><Text style={s.loaderText}>جاري فتح GameRush…</Text></View>}
      {error && <View style={s.error}><Text style={s.errorTitle}>تعذر الاتصال بالموقع</Text><Text style={s.errorText}>تحقق من الإنترنت واسحب الشاشة للتحديث.</Text></View>}
    </View>
  </SafeAreaView>
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#050810'},
  wrap:{flex:1,backgroundColor:'#050810'},
  web:{flex:1,backgroundColor:'#050810'},
  loader:{position:'absolute',left:0,right:0,top:0,bottom:0,alignItems:'center',justifyContent:'center',backgroundColor:'#050810'},
  loaderText:{marginTop:12,color:'#dce5f0',fontWeight:'800'},
  error:{position:'absolute',left:20,right:20,bottom:30,padding:18,borderRadius:18,backgroundColor:'#0b1322',borderWidth:1,borderColor:'#26364b'},
  errorTitle:{color:'#fff',fontSize:16,fontWeight:'900',textAlign:'center'},
  errorText:{color:'#aeb9c9',fontSize:13,marginTop:6,textAlign:'center',lineHeight:20}
});
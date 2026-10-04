import React,{useEffect,useState} from 'react';
import {ActivityIndicator,FlatList,Linking,Pressable,SafeAreaView,StatusBar,StyleSheet,Text,View} from 'react-native';
import {supabase} from './src/lib/supabase';

type Game={slug:string;name:string;unit:string;tag:string;description:string;image_url:string;active:boolean};

const WEB='https://gamerushiraq.github.io/gamerushiraq2027/';

export default function App(){
 const [games,setGames]=useState<Game[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{(async()=>{
   const {data,error}=await supabase.from('game_catalog').select('slug,name,unit,tag,description,image_url,active').eq('active',true).order('sort_order',{ascending:true});
   if(error)setError(error.message); else setGames(data||[]);
   setLoading(false);
 })()},[]);
 const open=(url:string)=>Linking.openURL(url).catch(()=>{});
 return <SafeAreaView style={s.safe}>
   <StatusBar barStyle="light-content"/>
   <View style={s.header}>
     <View><Text style={s.brand}>GameRush</Text><Text style={s.sub}>IRAQ • TOP-UP</Text></View>
     <Pressable style={s.track} onPress={()=>open(WEB+'track.html')}><Text style={s.trackText}>تتبع طلب</Text></Pressable>
   </View>
   <View style={s.hero}>
     <Text style={s.kicker}>GAMERUSH // IRAQ</Text>
     <Text style={s.title}>اشحن ألعابك بسرعة ⚡</Text>
     <Text style={s.desc}>واجهة التطبيق مرتبطة مباشرة ببيانات GameRush وSupabase.</Text>
     <Pressable style={s.cta} onPress={()=>open(WEB+'shop.html')}><Text style={s.ctaText}>فتح المتجر</Text></Pressable>
   </View>
   <View style={s.sectionHead}><Text style={s.section}>الألعاب</Text><Text style={s.live}>● LIVE</Text></View>
   {loading?<ActivityIndicator size="large" color="#b7ff2a" style={{marginTop:30}}/>:
    error?<Text style={s.error}>تعذر تحميل الألعاب: {error}</Text>:
    <FlatList data={games} keyExtractor={g=>g.slug} contentContainerStyle={s.list} renderItem={({item})=>
      <Pressable style={s.card} onPress={()=>open(WEB+'game.html?game='+encodeURIComponent(item.slug))}>
        <View style={s.art}><Text style={s.artText}>GR</Text></View>
        <View style={s.cardBody}><Text style={s.game}>{item.name}</Text><Text style={s.meta}>{item.unit}{item.tag?' • '+item.tag:''}</Text><Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text></View>
        <Text style={s.arrow}>‹</Text>
      </Pressable>
    }/>}
   <View style={s.bottom}>
     <Pressable onPress={()=>open(WEB)}><Text style={s.bottomText}>الموقع</Text></Pressable>
     <Pressable onPress={()=>open('https://wa.me/9647818319951')}><Text style={s.bottomText}>الدعم</Text></Pressable>
     <Pressable onPress={()=>open(WEB+'services.html')}><Text style={s.bottomText}>الخدمات</Text></Pressable>
   </View>
 </SafeAreaView>
}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#050810'},
 header:{paddingHorizontal:20,paddingTop:14,paddingBottom:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 brand:{color:'#fff',fontSize:25,fontWeight:'900'},sub:{color:'#00e5ff',fontSize:10,fontWeight:'800',letterSpacing:2},
 track:{borderWidth:1,borderColor:'#26364b',paddingHorizontal:13,paddingVertical:9,borderRadius:14},trackText:{color:'#fff',fontWeight:'700'},
 hero:{margin:14,padding:22,borderRadius:25,backgroundColor:'#0b1322',borderWidth:1,borderColor:'#20304a'},
 kicker:{color:'#b7ff2a',fontSize:11,fontWeight:'900',letterSpacing:1.5},title:{color:'#fff',fontSize:30,fontWeight:'900',marginTop:8},desc:{color:'#aeb9c9',fontSize:14,lineHeight:22,marginTop:8},
 cta:{marginTop:18,alignSelf:'flex-start',backgroundColor:'#b7ff2a',paddingHorizontal:20,paddingVertical:12,borderRadius:15},ctaText:{color:'#07100a',fontWeight:'900'},
 sectionHead:{paddingHorizontal:20,paddingTop:8,paddingBottom:6,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},section:{color:'#fff',fontSize:22,fontWeight:'900'},live:{color:'#b7ff2a',fontWeight:'900',fontSize:11},
 list:{padding:12,paddingBottom:90},card:{minHeight:105,marginBottom:10,padding:12,borderRadius:19,backgroundColor:'#0a111e',borderWidth:1,borderColor:'#18263a',flexDirection:'row',alignItems:'center'},art:{width:76,height:76,borderRadius:15,backgroundColor:'#101b2d',alignItems:'center',justifyContent:'center'},artText:{color:'#00e5ff',fontSize:22,fontWeight:'900'},cardBody:{flex:1,marginHorizontal:13},game:{color:'#fff',fontSize:17,fontWeight:'900'},meta:{color:'#b7ff2a',fontSize:11,fontWeight:'800',marginTop:3},cardDesc:{color:'#8896aa',fontSize:11,lineHeight:16,marginTop:5},arrow:{color:'#00e5ff',fontSize:30},error:{color:'#ff879b',padding:20},
 bottom:{position:'absolute',bottom:0,left:0,right:0,padding:15,backgroundColor:'#07101c',borderTopWidth:1,borderTopColor:'#162337',flexDirection:'row',justifyContent:'space-around'},bottomText:{color:'#dce5f0',fontWeight:'800'}
});
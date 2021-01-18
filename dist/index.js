!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.roov=t():e.roov=t()}(self,(function(){return(()=>{"use strict";var e,t,n={172:(e,t,n)=>{n.r(t),n.d(t,{player:()=>h});const i=JSON.parse('{"u2":"roov-player-v3","i8":"1.4.0"}');let a,o,s,r,l,d,v,c={content:{assetName:"",live:!1,url:"",contentLength:0,frameworkName:"HTML 5",frameworkVersion:"0.0.0",applicationName:i.u2,applicationVersion:i.i8,viewerId:"",customTags:{},deviceTags:{brand:"",manufacturer:"",model:"",type:"",os_name:"",os_version:"",category:""},TEST_CUSTOMER_KEY:"YOUR CONVIVA TEST CUSTOMER KEY",PRODUCTION_CUSTOMER_KEY:"YOUR CONVIVA PRODUCTION CUSTOMER KEY",gatewayUrl:""}};class h{constructor(e){a&&a.destroy(),r&&this.destroyPlayer(l),this.initializeAudio(e),this.initializeConfigAds(e),this.setupEvent(e)}initializeAudio({src:e="",autoplay:t=!1,convivaConfig:n=""}){this._src=e,this._player=document.getElementById("roov-player"),r=this._player,this._player.setAttribute("playsinline",""),this._player.src=this.isHLS()?"":e,n&&(this.convivaContentInfo={},this.convivaDeviceMetadata={},this.convivaDebug=n.debug,c.content.assetName=n.assetName,c.content.live=n.isLive,c.content.url=this._src,c.content.contentLength=this.duration(),c.content.TEST_CUSTOMER_KEY=n.TEST_CUSTOMER_KEY,c.content.PRODUCTION_CUSTOMER_KEY=n.PRODUCTION_CUSTOMER_KEY,c.content.gatewayUrl=n.gatewayUrl,c.content.customTags=n.customTags,c.content.deviceTags=n.deviceTags,this.setupConviva()),t&&(this._player.muted=!0,this.play()),console.log("isHLS",this.isHLS())}initializeConfigAds({withAds:e=!1,adElement:t="ad-container",adsURL:n,onPlaying:i,onBuffering:a,getBufferLength:o,onFinish:s}){"undefined"!=typeof google&&(this._withAds=e,this._adElement=t,this._adsURL=n,e&&(this.onPlaying=i,this.onBuffering=a,this.getBufferLength=o,this.onFinish=s,this.setUpIMA()))}destroyPlayer({onPlaying:e,onBuffering:t}){r.removeEventListener("playing",e),r.removeEventListener("waiting",t),r.removeEventListener("ended",v),r.removeEventListener("timeupdate",d)}setupEvent({onPlaying:e,onloaderror:t,onFinish:n,onTimeUpdate:i,onBuffering:a,getBufferLength:o}){l={onPlaying:e,onBuffering:a},this.onloaderror=t;let s,r=()=>{!this.isAllAdsCompleted&&this._withAds||n()};v=r,e&&this._player.addEventListener("playing",e),a&&this._player.addEventListener("waiting",a),n&&this._player.addEventListener("ended",r),this._player.addEventListener("timeupdate",s=()=>{if(i&&i(),o&&!this.isAdsPlaying){let t,n;const i=this._player.buffered,a=this._player.duration;if(i.length>0)for(var e=0;e<i.length;e++)if(i.start(i.length-1-e)<this._player.currentTime){t=i.end(i.length-1-e)/a*100,n=this._player.currentTime/a*100,this._hls?o(0,0):(o(n,t),n==t&&(this.isPostrollAllowed=!0));break}}d=s})}setupConviva(){this.initConvivaClient()}initConvivaClient(){if(this.convivaDebug){var e={};e[Conviva.Constants.GATEWAY_URL]=c.content.gatewayUrl,e[Conviva.Constants.LOG_LEVEL]=Conviva.Constants.LogLevel.DEBUG,Conviva.Analytics.init(c.content.TEST_CUSTOMER_KEY,null,e)}else Conviva.Analytics.init(c.content.PRODUCTION_CUSTOMER_KEY,null);this.videoAnalytics=Conviva.Analytics.buildVideoAnalytics(),this.adAnalytics=Conviva.Analytics.buildAdAnalytics(this.videoAnalytics)}reportPlaybackStart(){for(let e in c.content.tags)this.convivaContentInfo[e]=c.content.tags[e];this.videoAnalytics.reportPlaybackRequested(this.convivaContentInfo)}reportPlaybackEnd(){this.videoAnalytics.reportPlaybackEnded()}setVideoMetadata(){this.convivaContentInfo[Conviva.Constants.STREAM_URL]=c.content.url,this.convivaContentInfo[Conviva.Constants.ASSET_NAME]=c.content.assetName,this.convivaContentInfo[Conviva.Constants.IS_LIVE]=c.content.live?Conviva.Constants.StreamType.LIVE:Conviva.Constants.StreamType.VOD,this.convivaContentInfo[Conviva.Constants.PLAYER_NAME]=c.content.applicationName,this.convivaContentInfo[Conviva.Constants.VIEWER_ID]=c.content.viewerId,this.convivaContentInfo[Conviva.Constants.DEFAULT_RESOURCE]="Resource Unknown",this.convivaContentInfo[Conviva.Constants.DURATION]=c.content.contentLength,this.convivaContentInfo[Conviva.Constants.ENCODED_FRAMERATE]=0,this.convivaContentInfo[Conviva.Constants.FRAMEWORK_NAME]=c.content.frameworkName,this.convivaContentInfo[Conviva.Constants.FRAMEWORK_VERSION]=c.content.frameworkVersion,this.convivaContentInfo[Conviva.Constants.APPLICATION_VERSION]=c.content.applicationVersion}setDeviceMetaData(){this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.BRAND]=c.content.deviceTags.brand,this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.MANUFACTURER]=c.content.deviceTags.manufacturer,this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.MODEL]=c.content.deviceTags.model,this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.TYPE]="desktop"===c.content.deviceTags.type?Conviva.Constants.DeviceType.DESKTOP:"mobile"===c.content.deviceTags.type?Conviva.Constants.DeviceType.MOBILE:Conviva.Constants.DeviceType.CONSOLE_LOG,this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.OS_NAME]=c.content.deviceTags.os_name,this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.OS_VERSION]=c.content.deviceTags.os_version,this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.CATEGORY]="android"==c.content.deviceTags.category?Conviva.Constants.DeviceCategory.ANDROID:"ios"==c.content.deviceTags.category?Conviva.Constants.DeviceCategory.IOS:Conviva.Constants.DeviceCategory.WEB}setUpIMA(){this.createAdDisplayContainer(),o=new google.ima.AdsLoader(s),o.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,(e=>{this.onAdsManagerLoaded(e)}),!1),o.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,(e=>{this.onAdError(e)}),!1);this._player.onended=()=>{(this.isAllAdsCompleted||this.isPostrollAllowed)&&(o.contentComplete(),this.isContentFinished=!0)};var e=new google.ima.AdsRequest;e.adTagUrl=this._adsURL,e.linearAdSlotWidth=this._player.clientWidth,e.linearAdSlotHeight=this._player.clientHeight,e.nonLinearAdSlotWidth=this._player.clientWidth,e.nonLinearAdSlotHeight=this._player.clientHeight,o.requestAds(e)}createAdDisplayContainer(){s=new google.ima.AdDisplayContainer(document.getElementById("ad-container"),this._player)}playAds(){this._player.load(),s.initialize();let e=this._player.clientWidth,t=this._player.clientHeight;try{a.init(e,t,google.ima.ViewMode.NORMAL),a.start()}catch(e){console.log("AdsManager could not be started",e),this._player.play()}}onAdsManagerLoaded(e){var t=new google.ima.AdsRenderingSettings;t.restoreCustomPlaybackStateOnAdBreakComplete=!0,a=e.getAdsManager(this._player,t),a.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,(e=>{this.onAdError(e)})),a.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,(e=>{this.onContentPauseRequested(e)})),a.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,(e=>{this.onContentResumeRequested(e)})),a.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED,(e=>{this.onAdEvent(e)})),a.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS,(e=>{this.onAdEvent(e)})),a.addEventListener(google.ima.AdEvent.Type.LOADED,(e=>{this.onAdEvent(e)})),a.addEventListener(google.ima.AdEvent.Type.STARTED,(e=>{this.onAdEvent(e)})),a.addEventListener(google.ima.AdEvent.Type.COMPLETE,(e=>{this.onAdEvent(e)})),this.playAds()}onAdEvent(e){const t=google.ima.AdEvent.Type;switch(e.type){case t.LOADED:let n=e.getAd();console.log("onAdLoaded"),n.isLinear()||this.play();break;case t.STARTED:this.isAdsPlaying=!0,this.onPlaying&&this.onPlaying({state:"ADS"});break;case t.AD_BUFFERING:this.onBuffering();break;case t.COMPLETE:this.isAdsPlaying=!1;break;case t.AD_PROGRESS:let i=e.getAdData();this.getBufferLength&&this.getBufferLength(i.currentTime,i.duration);break;case t.ALL_ADS_COMPLETED:this.isAllAdsCompleted=!0,this.isContentFinished&&this.onFinish();break;default:console.log("onAdEvent")}}onAdError(e){console.log(e.getError()),a.destroy()}onContentPauseRequested(){this._player.pause()}onContentResumeRequested(){this.isContentFinished||this._player.play()}play(){this.isAdsPlaying?a.resume():this.isHLS()?n.e(801).then(n.t.bind(n,990,7)).then((({default:e})=>{e.isSupported()?(this._hls=new e,this._hls.loadSource(this._src),this._hls.attachMedia(this._player),this._hls.on(e.Events.MANIFEST_PARSED,(()=>{this.playVideo()}))):this._player.canPlayType("application/vnd.apple.mpegurl")&&(this._player.src=this._src,this._player.addEventListener("loadedmetadata",(()=>{this.playVideo()})))})):this.playVideo()}playVideo(){!this.isAdsLoaded&&this._withAds||this._player.play()}isHLS(){return/.m3u8$/.test(this._src)}pause(){this._player.pause(),this.isAdsPlaying&&a.pause()}volume(e){a&&0!=Object.keys(a).length&&a.setVolume(e),this._player.volume=e}duration(){return this._hls?"Infinity":this._player.duration}isPlaying(){return!this._player.paused}currentSource(){return this._player.src}currentTime(){return this._player.currentTime}seek(e){this._player.currentTime=e}muted(){0!=this._player.volume?this.volume(0):this.volume(1)}}}},i={};function a(e){if(i[e])return i[e].exports;var t=i[e]={exports:{}};return n[e].call(t.exports,t,t.exports,a),t.exports}return a.m=n,a.t=function(e,t){if(1&t&&(e=this(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);a.r(n);var i={};if(2&t&&"object"==typeof e&&e)for(const t in e)i[t]=()=>e[t];return i.default=()=>e,a.d(n,i),n},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,n)=>(a.f[n](e,t),t)),[])),a.u=e=>"Hls.js",a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="roov:",a.l=(n,i,o)=>{if(e[n])e[n].push(i);else{var s,r;if(void 0!==o)for(var l=document.getElementsByTagName("script"),d=0;d<l.length;d++){var v=l[d];if(v.getAttribute("src")==n||v.getAttribute("data-webpack")==t+o){s=v;break}}s||(r=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,a.nc&&s.setAttribute("nonce",a.nc),s.setAttribute("data-webpack",t+o),s.src=n),e[n]=[i];var c=(t,i)=>{s.onerror=s.onload=null,clearTimeout(h);var a=e[n];if(delete e[n],s.parentNode&&s.parentNode.removeChild(s),a&&a.forEach((e=>e(i))),t)return t(i)},h=setTimeout(c.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=c.bind(null,s.onerror),s.onload=c.bind(null,s.onload),r&&document.head.appendChild(s)}},a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;a.g.importScripts&&(e=a.g.location+"");var t=a.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),a.p=e})(),(()=>{var e={826:0};a.f.j=(t,n)=>{var i=a.o(e,t)?e[t]:void 0;if(0!==i)if(i)n.push(i[2]);else{var o=new Promise(((n,a)=>{i=e[t]=[n,a]}));n.push(i[2]=o);var s=a.p+a.u(t),r=new Error;a.l(s,(n=>{if(a.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var o=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.src;r.message="Loading chunk "+t+" failed.\n("+o+": "+s+")",r.name="ChunkLoadError",r.type=o,r.request=s,i[1](r)}}),"chunk-"+t)}};var t=self.webpackChunkroov=self.webpackChunkroov||[],n=t.push.bind(t);t.push=t=>{for(var i,o,[s,r,l]=t,d=0,v=[];d<s.length;d++)o=s[d],a.o(e,o)&&e[o]&&v.push(e[o][0]),e[o]=0;for(i in r)a.o(r,i)&&(a.m[i]=r[i]);for(l&&l(a),n(t);v.length;)v.shift()()}})(),a(172)})()}));
//# sourceMappingURL=index.js.map
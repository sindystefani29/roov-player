/*! (C) 2020 Conviva, Inc. All rights reserved. Confidential and proprietary. */

!function(t,i){"function"==typeof define&&define.amd?define(i):("object"==typeof exports||"object"==typeof module&&module.exports)&&(module.exports=i()),void 0!==t&&(void 0===t.Conviva?void 0===t.ConvivaModule&&(t.ConvivaModuleLoading||(t.ConvivaModuleLoading=!0,t.ConvivaModule=i(),delete t.ConvivaModuleLoading)):void 0===t.Conviva.ProxyMonitor&&(t.ConvivaModuleLoading||(i=i(),t.ConvivaModuleLoading=!0,t.Conviva.ProxyMonitor=i.ProxyMonitor,t.Conviva.Impl.Html5PlayerInterface=i.Impl.Html5PlayerInterface,t.Conviva.Impl.Html5Proxy=i.Impl.Html5Proxy,delete t.ConvivaModuleLoading)))}(this,function(){var a={};return function(){"use strict";!function(){a.Impl=a.Impl||{};var o=a.Impl.Html5PlayerInterface=function(t,i,n){var r=this;r.t=[],r.i=0,r.n=0,r.o=!1,r.e=n,this.a=new Conviva.Impl.Html5Timer,this.s=n.buildLogger(),this.s.setModuleName("Html5PlayerInterface"),this.r=-1,this.u=-1,this.v=function(t,i,n){void 0===n&&(n=r.h),r.c.push([t,i,n]),window.addEventListener?n.addEventListener(t,i,!1):n.attachEvent("on"+t,i)},this.f=function(t,i,n){void 0===n&&(n=r.h),window.removeEventListener?n.removeEventListener(t,i,!1):n.detachEvent("on"+t,i)},this.l=function(){r.v("ended",function(){r.d("ended")}),r.v("pause",function(){r.d("pause")}),r.v("playing",function(){0==r.h.currentTime?r.o=!0:0<r.h.currentTime&&(r.o=!1)}),r.v("waiting",function(){r.d("waiting")}),r.v("timeupdate",function(){r.o&&(r.i++,r.C.getPlayerState()===Conviva.PlayerStateManager.PlayerState.PLAYING||r.h.seeking||r.d("playing"))}),r.v("error",function(){var t;r.h.error&&(t=r.h.error.code,r.N(t))}),r.v("loadedmetadata",r.p),r.v("seeking",function(){r.isSeekStarted||(r.isSeekStarted=!0,r.C.setPlayerSeekStart(-1)),r.o&&r.C.getPlayerState()!==Conviva.PlayerStateManager.PlayerState.BUFFERING&&(r.R("Adjusting Conviva player state to: BUFFERING"),r.d("waiting"))}),r.v("seeked",function(){r.isSeekStarted=!1,r.C.setPlayerSeekEnd()}),r.A()},this.getPHT=function(){return r.h?1e3*r.h.currentTime:Conviva.PlayerStateManager.DEFAULT_PHT},this.getBufferLength=function(){if(!r.h)return Conviva.PlayerStateManager.DEFAULT_BUFFER_LENGTH;var t=r.h.buffered;if(void 0!==t){for(var i=0,n=0;n<t.length;n++){var o=t.start(n),e=t.end(n);o<=r.h.currentTime&&r.h.currentTime<e&&(i+=e-r.h.currentTime)}return r.g=i,1e3*r.g}},this.getSignalStrength=function(){return Conviva.PlayerStateManager.DEFAULT_SIGNAL_STRENGTH},this.getRenderedFrameRate=function(){return Conviva.PlayerStateManager.DEFAULT_RENDERED_FRAME_RATE},this.A=function(){if(void 0!==r.h.children){var t=function(){r.R("Caught non-specific error from <source> element, reporting as ERR_UNKNOWN"),r.N(0)};r.h.y=r.h.children;for(var i=0;i<r.h.y.length;i++){var n=r.h.y[i];"SOURCE"==n.tagName&&r.v("error",t,n)}}},this.I=function(){for(var t=0;t<r.c.length;t++){var i=r.c[t];r.f(i[0],i[1],i[2])}r.c=[]},this.w=function(){r._=r.h.readyState,0===r.h.readyState||r.h.ended?r.m(Conviva.PlayerStateManager.PlayerState.STOPPED):(r.h.paused||r.h.seeking)&&r.m(Conviva.PlayerStateManager.PlayerState.PAUSED),r.h.readyState>=r.h.HAVE_METADATA&&r.p()},this.d=function(t){var i=r.O(t);r.R("Received HTML5 event: "+t+". Mapped to Conviva player state: "+i),r.m(i)},this.m=function(t){r.C.setPlayerState(t),r.M(),r.D=!0},this.O=function(t){switch(t){case"playing":return Conviva.PlayerStateManager.PlayerState.PLAYING;case"waiting":return Conviva.PlayerStateManager.PlayerState.BUFFERING;case"ended":case"stopped":return Conviva.PlayerStateManager.PlayerState.STOPPED;case"pause":return Conviva.PlayerStateManager.PlayerState.PAUSED;default:return Conviva.PlayerStateManager.PlayerState.UNKNOWN}},this.N=function(t){var i;switch(t){case 1:i="MEDIA_ERR_ABORTED";break;case 2:i="MEDIA_ERR_NETWORK";break;case 3:i="MEDIA_ERR_DECODE";break;case 4:i="MEDIA_ERR_SRC_NOT_SUPPORTED";break;default:i="MEDIA_ERR_UNKNOWN"}r.R("Reporting error: code="+t+" message="+i);t=Conviva.Client.ErrorSeverity.FATAL;r.C.sendError(i,t)},this.p=function(){var t=r.h.duration;isNaN(t)||t==1/0||r.C.setDuration(t);t=r.h.videoWidth;!isNaN(t)&&0<=t&&r.C.setVideoResolutionWidth(t);t=r.h.videoHeight;!isNaN(t)&&0<=t&&r.C.setVideoResolutionHeight(t)},this.P=function(){this.V=0,this.U=0,this.g=0,this.H=this.a.createTimer(this.j,500,"Html5PlayerInterface._poll()")},this.j=function(){r.h&&(r.b(),r.T(),r.k())},this.b=function(){var t=r.h.videoWidth;!isNaN(t)&&0<=t&&t!=r.r&&(r.C.setVideoResolutionWidth(t),r.r=t);t=r.h.videoHeight;!isNaN(t)&&0<=t&&t!=r.u&&(r.C.setVideoResolutionHeight(t),r.u=t)},this.T=function(){r.V=r.U,r.U=r.h.currentTime;var t,i=Date.now();0<r.F&&i>r.F&&((t=r.U-r.V)<0&&(t=0),t=t/(i-r.F)*1e3,r.t.push(t)),r.F=i,r.t.length>Math.max(8,4)&&r.t.shift()},this.k=function(){var t=r.t.length;if(t>=Math.min(4,8)){for(var i=0,n=r.t.slice(),o=0;o<n.length;o++)i+=n[o];i/=t;var e=1,a=.25,s=r.h.playbackRate;!isNaN(s)&&s!=1/0&&0<s&&(0<Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")&&s<.5&&(s=.5),e*=s,a*=s);s=r.C.getPlayerState();if(s!=Conviva.PlayerStateManager.PlayerState.PLAYING&&4<=t&&Math.abs(i-e)<a)return r.R("Adjusting Conviva player state to: PLAYING"),void r.m(Conviva.PlayerStateManager.PlayerState.PLAYING);s==Conviva.PlayerStateManager.PlayerState.PLAYING&&8<=t&&0==i?r.h.paused?s!=Conviva.PlayerStateManager.PlayerState.PAUSED&&(r.R("Adjusting Conviva player state to: PAUSED"),r.m(Conviva.PlayerStateManager.PlayerState.PAUSED)):r.h.seeking||(r.R("Adjusting Conviva player state to: BUFFERING"),r.m(Conviva.PlayerStateManager.PlayerState.BUFFERING)):r.o&&(r.h.paused?(s!=Conviva.PlayerStateManager.PlayerState.PAUSED&&(r.R("Adjusting Conviva player state to: PAUSED"),r.m(Conviva.PlayerStateManager.PlayerState.PAUSED)),r.i=r.n):r.h.seeking||(1<r.i&&r.i==r.n&&(r.R("Adjusting Conviva player state to: BUFFERING"),r.m(Conviva.PlayerStateManager.PlayerState.BUFFERING)),r.n=r.i))}},this.S=function(){this.H()},this.M=function(){r.t=[],r.V=-1,r.F=0},this.L=function(){r.n=0,r.i=0},this.R=function(t){this.s.log(t,Conviva.SystemSettings.LogLevel.DEBUG)},function(t,i){if(this.R("Html5PlayerInterface._constr()"),!t)throw new Error("Html5PlayerInterface: playerStateManager argument cannot be null.");if(!i)throw new Error("Html5PlayerInterface: videoElement argument cannot be null.");this.C=t,this.h=i,this.c=[],this.l(),this.M(),this.L(),this.P(),this.w(),this.C.setClientMeasureInterface(this),this.C.setModuleNameAndVersion("HTML5",o.version),null!=this.e&&null!=this.e.x&&null==this.e.x.getFrameworkName()&&this.C.setPlayerType("HTML5")}.apply(this,arguments),this.cleanup=function(){this.R("Html5PlayerInterface.cleanup()"),this.S(),this.I(),this.h=null,this.C=null}};o.version="4.0.5L",a.Impl=a.Impl||{};var e=a.Impl.Html5Proxy=function(t,i,n,r){var u=this;u.t=[],u.i=0,u.n=0,u.o=!1,this.a=new r.Impl.Html5Timer,this.r=-1,this.u=-1,this.B=r.Constants.PlayerState.UNKNOWN,this.v=function(t,i,n){void 0===n&&(n=u.h),u.c.push([t,i,n]),window.addEventListener?n.addEventListener(t,i,!1):n.attachEvent("on"+t,i)},this.f=function(t,i,n){void 0===n&&(n=u.h),window.removeEventListener?n.removeEventListener(t,i,!1):n.detachEvent("on"+t,i)},this.l=function(){u.v("ended",function(){u.m(r.Constants.PlayerState.STOPPED)}),u.v("pause",function(){u.m(r.Constants.PlayerState.PAUSED)}),u.v("playing",function(){0==u.h.currentTime?u.o=!0:0<u.h.currentTime&&(u.o=!1)}),u.v("waiting",function(){u.m(r.Constants.PlayerState.BUFFERING)}),u.v("timeupdate",function(){u.o&&(u.i++,u.B==r.Constants.PlayerState.PLAYING||u.h.seeking||u.m(r.Constants.PlayerState.PLAYING))}),u.v("error",function(){var t;null!=u.h&&u.h.error&&(t="Error Message: "+u.h.error.message+", Error Code: "+u.h.error.code,u.G.reportPlaybackError(t,r.Constants.ErrorSeverity.FATAL))}),u.v("loadedmetadata",function(){var t=u.h.duration;isNaN(t)||t==1/0||((i={})[r.Constants.DURATION]=t,u.G.setContentInfo(i));var t=u.h.videoWidth,i=u.h.videoHeight;(!isNaN(t)&&0<t||!isNaN(i)&&0<i)&&u.G.reportPlaybackMetric(r.Constants.Playback.RESOLUTION,t,i,"CONVIVA")}),u.v("seeking",function(){u.isSeekStarted||(u.isSeekStarted=!0,u.G.reportPlaybackMetric(r.Constants.Playback.SEEK_STARTED,"CONVIVA")),u.o&&u.B!=r.Constants.PlayerState.BUFFERING&&(u.R("Adjusting Conviva player state to: BUFFERING"),u.m(r.Constants.PlayerState.BUFFERING))}),u.v("seeked",function(){u.isSeekStarted=!1,u.G.reportPlaybackMetric(r.Constants.Playback.SEEK_ENDED,"CONVIVA")}),u.A()},this.getBufferLength=function(){var t=u.h.buffered;if(void 0!==t){for(var i=0,n=0;n<t.length;n++){var o=t.start(n),e=t.end(n);o<=u.h.currentTime&&u.h.currentTime<e&&(i+=e-u.h.currentTime)}return u.g=i,1e3*u.g}},this.A=function(){if(void 0!==u.h.children){var t=function(){u.R("Caught non-specific error from <source> element, reporting as ERR_UNKNOWN"),u.N(0)};u.h.y=u.h.children;for(var i=0;i<u.h.y.length;i++){var n=u.h.y[i];"SOURCE"==n.tagName&&u.v("error",t,n)}}},this.I=function(){for(var t=0;t<u.c.length;t++){var i=u.c[t];u.f(i[0],i[1],i[2])}u.c=[]},this.w=function(){u._=u.h.readyState,0===u.h.readyState||u.h.ended?u.m(r.Constants.PlayerState.STOPPED):(u.h.paused||u.h.seeking)&&u.m(r.Constants.PlayerState.PAUSED)},this.m=function(t){u.B=t,u.G.reportPlaybackMetric(r.Constants.Playback.PLAYER_STATE,u.B,"CONVIVA"),u.M(),u.D=!0},this.N=function(t){var i;switch(t){case 1:i="MEDIA_ERR_ABORTED";break;case 2:i="MEDIA_ERR_NETWORK";break;case 3:i="MEDIA_ERR_DECODE";break;case 4:i="MEDIA_ERR_SRC_NOT_SUPPORTED";break;default:i="MEDIA_ERR_UNKNOWN"}u.R("Reporting error: code="+t+" message="+i);t=r.Client.ErrorSeverity.FATAL;u.G.reportPlaybackError(i,t)},this.P=function(){this.V=0,this.U=0,this.g=0,this.H=this.a.createTimer(this.j,500,"Html5Proxy._poll()")},this.j=function(){u.h?(u.G.reportPlaybackMetric(r.Constants.Playback.PLAY_HEAD_TIME,1e3*u.h.currentTime,"CONVIVA"),u.G.reportPlaybackMetric(r.Constants.Playback.BUFFER_LENGTH,u.getBufferLength(),"CONVIVA"),u.G.reportPlaybackMetric(r.Constants.Playback.RESOLUTION,u.h.videoWidth,u.h.videoHeight,"CONVIVA"),u.T(),u.k()):(u.G.reportPlaybackMetric(r.Constants.Playback.PLAY_HEAD_TIME,r.PlayerStateManager.DEFAULT_PHT,"CONVIVA"),u.G.reportPlaybackMetric(r.Constants.Playback.BUFFER_LENGTH,r.PlayerStateManager.DEFAULT_BUFFER_LENGTH,"CONVIVA"))},this.T=function(){u.V=u.U,u.U=u.h.currentTime;var t,i=Date.now();0<u.F&&i>u.F&&((t=u.U-u.V)<0&&(t=0),t=t/(i-u.F)*1e3,u.t.push(t)),u.F=i,u.t.length>Math.max(8,4)&&u.t.shift()},this.k=function(){var t=u.t.length;if(t>=Math.min(4,8)){for(var i=0,n=u.t.slice(),o=0;o<n.length;o++)i+=n[o];i/=t;var e=1,a=.25,s=u.h.playbackRate;if(!isNaN(s)&&s!=1/0&&0<s&&(0<Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")&&s<.5&&(s=.5),e*=s,a*=s),u.B!=r.Constants.PlayerState.PLAYING&&4<=t&&Math.abs(i-e)<a)return u.R("Adjusting Conviva player state to: PLAYING"),void u.m(r.Constants.PlayerState.PLAYING);u.B==r.Constants.PlayerState.PLAYING&&8<=t&&0==i?u.h.paused?u.B!=r.Constants.PlayerState.PAUSED&&(u.R("Adjusting Conviva player state to: PAUSED"),u.m(r.Constants.PlayerState.PAUSED)):u.h.seeking||(u.R("Adjusting Conviva player state to: BUFFERING"),u.m(r.Constants.PlayerState.BUFFERING)):u.o&&(u.h.paused?(u.B!=r.Constants.PlayerState.PAUSED&&(u.R("Adjusting Conviva player state to: PAUSED"),u.m(r.Constants.PlayerState.PAUSED)),u.i=u.n):u.h.seeking||(1<u.i&&u.i==u.n&&(u.R("Adjusting Conviva player state to: BUFFERING"),u.m(r.Constants.PlayerState.BUFFERING)),u.n=u.i))}},this.S=function(){null!=this.H&&this.H()},this.M=function(){u.t=[],u.V=-1,u.F=0},this.L=function(){u.n=0,u.i=0},this.R=function(t){this.s.log(t,r.SystemSettings.LogLevel.DEBUG)},function(t,i,n){if(!t)throw new Error("Html5Proxy: videoElement argument cannot be null.");this.h=t,this.G=n,this.s=i.buildLogger(),this.s.setModuleName("Html5Proxy"),this.R("Html5Proxy._constr()"),this.c=[],this.l(),this.M(),this.L(),this.P(),this.w(),(i={})[r.Constants.MODULE_NAME]="HTML5",i[r.Constants.MODULE_VERSION]=e.version,this.G.setContentInfo(i),(i={})[r.Constants.FRAMEWORK_NAME]="HTML5",this.G.setPlayerInfo(i)}.apply(this,arguments),this.cleanup=function(){this.R("Html5Proxy.cleanup()"),this.S(),this.I(),this.h=null}};e.version="4.0.5",a.ProxyMonitor={K:null,release:function(){null!=this.K&&this.K.cleanup()},initConvivaDropIn:function(t,i,n,o){if(null!==t&&t instanceof HTMLVideoElement)return this.K=new a.Impl.Html5Proxy(t,i,n,o),this.K;throw new Error("No player proxy initialized")}}}()}(),a});
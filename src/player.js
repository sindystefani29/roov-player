import Hls from "hls.js/dist/hls.light";

let adsManager, _player, _playerConfig, _timeupdateListener, _onFinishListener

export default class player {
  constructor(config) {
    if(adsManager){
      adsManager.destroy()
    }
    if(_player){
      this.destroyPlayer(_playerConfig)
    }

    // init audio
    this.initializeAudio(config);

    // init ads
    this.initializeConfigAds(config);

    // setup event
    this.setupEvent(config);
  }

  initializeAudio({ src = "", autoplay = false }) {
    this._src = src;
    this._player = document.getElementById('roov-player');
    _player = this._player
    this._player.setAttribute("playsinline", "");
    this._player.src = !this.isHLS() ? src : '';
    if(autoplay){
      this._player.muted = true
      this.play()
    }
    console.log('isHLS', this.isHLS())
  }

  initializeConfigAds({ 
    withAds = false, 
    adElement = "ad-container", 
    adsURL,
    onPlaying,
    onBuffering,
    getBufferLength,
    onFinish
  }) {
    if (typeof google === "undefined") {
      return;
    }
    this._withAds = withAds;
    this._adElement = adElement;
    this._adsURL = adsURL;
    if (withAds) {
      this.onPlaying = onPlaying
      this.onBuffering = onBuffering
      this.getBufferLength = getBufferLength
      this.onFinish = onFinish
      this.initializeIMA();
    }
  }

  destroyPlayer({
    onPlaying,
    onBuffering
  }){
    _player.removeEventListener("playing", onPlaying);
    _player.removeEventListener("waiting", onBuffering);
    _player.removeEventListener("ended", _onFinishListener);
    _player.removeEventListener("timeupdate", _timeupdateListener);
  }

  setupEvent({
    onPlaying,
    onloaderror,
    onFinish,
    onTimeUpdate,
    onBuffering,
    getBufferLength
  }){
    _playerConfig = { onPlaying, onBuffering }

    this.onloaderror = onloaderror;

    let timeupdateListener, onFinishListener = () => {
      if(this.isAllAdsCompleted || !this._withAds){
        onFinish()
      }
    }

    _onFinishListener = onFinishListener

    if(onPlaying) {
      this._player.addEventListener("playing", onPlaying);
    }
    if(onBuffering) {
      this._player.addEventListener("waiting", onBuffering);
    }
    if(onFinish) {
      this._player.addEventListener("ended", onFinishListener);
    }
    this._player.addEventListener("timeupdate", timeupdateListener = () => {
      if (onTimeUpdate) {
        onTimeUpdate();
      }
      if (getBufferLength) {
        let bufferedEnd, currentSeconds
        const buffered = this._player.buffered;
        const duration = this._player.duration;
        if (buffered.length > 0) {
          for (var i = 0; i < buffered.length; i++) {
            if (buffered.start(buffered.length - 1 - i) < this._player.currentTime) {
              bufferedEnd = (buffered.end(buffered.length - 1 - i) / duration) * 100
              currentSeconds = (this._player.currentTime / duration) * 100
              if (this._hls) {
                getBufferLength(0, 0);
              } else {
                getBufferLength(currentSeconds, bufferedEnd);
              }
              break;
            }
          }
        }
      }
      _timeupdateListener = timeupdateListener
    });
  }

  initializeIMA() {
    console.log('initializing IMA')
    this._adContainer = document.getElementById(this._adElement)
    // this._adContainer.addEventListener('click', () => { 
    //   this.adContainerClick() 
    // });
    this._adDisplayContainer = new google.ima.AdDisplayContainer(this._adContainer, this._player);
    this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);

    this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e) => { 
      this.onAdsManagerLoaded(e) 
    }, false);

    this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e) => { 
      this.onAdError(e) 
    }, false);

    this._player.addEventListener('ended', () => {
      this._adsLoader.contentComplete();
      this.isContentFinished = true //prevent post-roll to re-play the content
    })

    this._adsRequest = new google.ima.AdsRequest();
    this._adsRequest.adTagUrl = this._adsURL

    this._adsRequest.linearAdSlotWidth = this._player.clientWidth;
    this._adsRequest.linearAdSlotHeight = this._player.clientHeight;
    this._adsRequest.nonLinearAdSlotWidth = this._player.clientWidth;
    this._adsRequest.nonLinearAdSlotHeight = this._player.clientHeight / 3;

    this._adsLoader.requestAds(this._adsRequest);
  }
  // adContainerClick() {
  //   console.log("ad container clicked");
  //   if (this._player.paused) {
  //     this.play();
  //   } else {
  //     this.pause();
  //   }
  // }
  onAdsManagerLoaded(event) {
    console.log('onAdsManagerLoaded')
    this._adsManager = event.getAdsManager(this._player);
    adsManager = this._adsManager
    this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e) => { this.onAdError(e) });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => { this.onContentPauseRequested() });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => { this.onContentResumeRequested() });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, (e) => { this.onAdLoaded(e) });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, (e) => { this.onAdEvent(e) });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, (e) => { this.onAdEvent(e) });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.AD_BUFFERING, (e) => { this.onAdEvent(e) });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, (e) => { this.onAdEvent(e) });
    this._adsManager.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, (e) => { this.onAdEvent(e) });
    this.loadAds(event)
  }

  onAdEvent(e){
    const currentType = google.ima.AdEvent.Type
    switch(e.type){
      case currentType.STARTED:
        this.isAdsPlaying = true
        this.onPlaying({state: 'ADS'})
        break;
      case currentType.AD_BUFFERING:
        this.onBuffering()
        break;
      case currentType.COMPLETE:
        this.isAdsPlaying = false
        break;
      case currentType.AD_PROGRESS:
        let adData = e.getAdData();
        this.getBufferLength(adData.currentTime, adData.duration);
        break;
      case currentType.ALL_ADS_COMPLETED:
        this.isAllAdsCompleted = true
        if(this.isContentFinished){
          this.onFinish()
        }
        break;
      default:
        console.log('onAdEvent')
    }
  }

  onAdLoaded(event) {
    let ad = event.getAd();
    console.log('onAdLoaded')
    if (!ad.isLinear()) {
      this.play();
    }
  }

  onAdError(event) {
    console.log(event.getError());
    if (this._adsManager) {
      this._adsManager.destroy();
    }
  }

  onContentPauseRequested() {
    this.pause();
  }

  onContentResumeRequested() {
    this.play();
  }

  loadAds(event) {
    // Prevent this function from running on if there are already ads loaded
    if (this.isAdsLoaded) {
      return;
    }
    this.isAdsLoaded = true

    // Prevent triggering immediate playback when ads are loading
    event.preventDefault();

    console.log("loading ads");

    this._player.load();
    this._adDisplayContainer.initialize();

    let width = this._player.clientWidth;
    let height = this._player.clientHeight;
    try {
      this._adsManager.init(width, height, google.ima.ViewMode.NORMAL);
      this._adsManager.start();
    } catch (adError) {
      // Play the video without ads, if an error occurs
      console.log("AdsManager could not be started", adError);
      this.play();
    }
  }

  play(){
    if(this.isAdsPlaying){
      this._adsManager.resume()
      return;
    }
    if(this.isHLS()){
      if (Hls.isSupported()) {
        this._hls = new Hls();
        this._hls.loadSource(this._src);
        this._hls.attachMedia(this._player);
        this._hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.playVideo()
        });
      }
      else if (this._player.canPlayType('application/vnd.apple.mpegurl')) {
        this._player.src = this._src;
        this._player.addEventListener('loadedmetadata', () => {
          this.playVideo()
        });
      }
    }else{
      this.playVideo()
    }
  }

  playVideo(){
    if((this.isAdsLoaded || !this._withAds) && !this.isContentFinished){
      this._player.play()
    }
  }

  isHLS() {
    return /.m3u8$/.test(this._src);
  }

  pause() {
    this._player.pause()
    if(this.isAdsPlaying){
      this._adsManager.pause()
    }
  }

  volume(v) {
    if (this._adsManager) {
      if (Object.keys(this._adsManager).length != 0) {
        this._adsManager.setVolume(v);
      }
    }
    this._player.volume = v;
  }

  duration() {
    return this._hls ? "Infinity" : this._player.duration;
  }

  isPlaying() {
    return !this._player.paused;
  }

  currentSource() {
    return this._player.src;
  }

  currentTime() {
    return this._player.currentTime;
  }

  seek(time) {
    this._player.currentTime = time;
  }

  muted() {
    if (this._player.volume != 0) {
      this.volume(0);
    } else {
      this.volume(1);
    }
  }
}
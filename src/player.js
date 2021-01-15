import { name as pkgName, version as pkgVersion } from '../package.json'
let adsManager, adsLoader, adDisplayContainer
let _player, _playerConfig, _timeupdateListener, _onFinishListener
let configs = {
  content: {
    assetName: '',
    live: false,
    url: "",
    contentLength: 0,
    frameworkName: 'HTML 5',
    frameworkVersion: '0.0.0',
    applicationName: pkgName,
    applicationVersion: pkgVersion,
    viewerId: "",
    customTags: {}, // Custom metadata
    deviceTags: {
      brand: '',
      manufacturer: '',
      model: '',
      type: '',
      os_name: '',
      os_version: '',
      category: ''
    },
    TEST_CUSTOMER_KEY: "YOUR CONVIVA TEST CUSTOMER KEY",
    PRODUCTION_CUSTOMER_KEY: 'YOUR CONVIVA PRODUCTION CUSTOMER KEY',
    gatewayUrl: '',
  }
};

export default class player {
  constructor(config) {
    if (adsManager) {
      adsManager.destroy()
    }
    if (_player) {
      this.destroyPlayer(_playerConfig)
    }

    // init audio
    this.initializeAudio(config);

    // init ads
    this.initializeConfigAds(config);

    // setup event
    this.setupEvent(config);
  }

  initializeAudio({ src = "", autoplay = false, convivaConfig = '' }) {
    this._src = src;
    this._player = document.getElementById('roov-player');
    _player = this._player
    this._player.setAttribute("playsinline", "");
    this._player.src = !this.isHLS() ? src : '';
    if (convivaConfig) {
      //set conviva info state
      this.convivaContentInfo = {}
      this.convivaDeviceMetadata = {}

      //set convivaDebug state
      this.convivaDebug = convivaConfig.debug;

      // Change the configs values for the corresponding stream properties values
      configs.content.assetName = convivaConfig.assetName;
      configs.content.live = convivaConfig.isLive;
      configs.content.url = this._src;
      configs.content.contentLength = this.duration();
      configs.content.TEST_CUSTOMER_KEY = convivaConfig.TEST_CUSTOMER_KEY;
      configs.content.PRODUCTION_CUSTOMER_KEY = convivaConfig.PRODUCTION_CUSTOMER_KEY;
      configs.content.gatewayUrl = convivaConfig.gatewayUrl;
      configs.content.customTags = convivaConfig.customTags;
      configs.content.deviceTags = convivaConfig.deviceTags;
      //call setup conviva function
      this.setupConviva()
    }
    if (autoplay) {
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
    }
  }

  destroyPlayer({
    onPlaying,
    onBuffering
  }) {
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
  }) {
    _playerConfig = { onPlaying, onBuffering }

    this.onloaderror = onloaderror;

    let timeupdateListener, onFinishListener = () => {
      if (this.isAllAdsCompleted || !this._withAds) {
        onFinish()
      }
    }

    _onFinishListener = onFinishListener

    if (onPlaying) {
      this._player.addEventListener("playing", onPlaying);
    }
    if (onBuffering) {
      this._player.addEventListener("waiting", onBuffering);
    }
    if (onFinish) {
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

  setupConviva() {
    this.initConvivaClient()
  }
  // Initializes the Conviva Client
  initConvivaClient() {
    if (this.convivaDebug) {
      var settings = {};
      settings[Conviva.Constants.GATEWAY_URL] = configs.content.gatewayUrl;
      settings[Conviva.Constants.LOG_LEVEL] = Conviva.Constants.LogLevel.DEBUG;
      Conviva.Analytics.init(configs.content.TEST_CUSTOMER_KEY, null, settings);
    } else {
      // production release
      Conviva.Analytics.init(configs.content.PRODUCTION_CUSTOMER_KEY, null);
    }
    this.videoAnalytics = Conviva.Analytics.buildVideoAnalytics();
    this.adAnalytics = Conviva.Analytics.buildAdAnalytics(this.videoAnalytics);
  }

  reportPlaybackStart() {
    for (let key in configs.content.tags) {
      this.convivaContentInfo[key] = configs.content.tags[key];
    }
    this.videoAnalytics.reportPlaybackRequested(this.convivaContentInfo);
  }

  reportPlaybackEnd() {
    this.videoAnalytics.reportPlaybackEnded();
  }

  setVideoMetadata() {
    this.convivaContentInfo[Conviva.Constants.STREAM_URL] = configs.content.url
    this.convivaContentInfo[Conviva.Constants.ASSET_NAME] = configs.content.assetName
    this.convivaContentInfo[Conviva.Constants.IS_LIVE] = configs.content.live ? Conviva.Constants.StreamType.LIVE : Conviva.Constants.StreamType.VOD
    this.convivaContentInfo[Conviva.Constants.PLAYER_NAME] = configs.content.applicationName
    this.convivaContentInfo[Conviva.Constants.VIEWER_ID] = configs.content.viewerId
    this.convivaContentInfo[Conviva.Constants.DEFAULT_RESOURCE] = 'Resource Unknown'
    this.convivaContentInfo[Conviva.Constants.DURATION] = configs.content.contentLength
    this.convivaContentInfo[Conviva.Constants.ENCODED_FRAMERATE] = 0
    this.convivaContentInfo[Conviva.Constants.FRAMEWORK_NAME] = configs.content.frameworkName
    this.convivaContentInfo[Conviva.Constants.FRAMEWORK_VERSION] = configs.content.frameworkVersion
    this.convivaContentInfo[Conviva.Constants.APPLICATION_VERSION] = configs.content.applicationVersion
  }

  setDeviceMetaData() {
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.BRAND] = configs.content.deviceTags.brand
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.MANUFACTURER] = configs.content.deviceTags.manufacturer
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.MODEL] = configs.content.deviceTags.model
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.TYPE] = configs.content.deviceTags.type === 'desktop' ? Conviva.Constants.DeviceType.DESKTOP : configs.content.deviceTags.type === 'mobile' ? Conviva.Constants.DeviceType.MOBILE : Conviva.Constants.DeviceType.CONSOLE_LOG
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.OS_NAME] = configs.content.deviceTags.os_name
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.OS_VERSION] = configs.content.deviceTags.os_version
    this.convivaDeviceMetadata[Conviva.Constants.DeviceMetadata.CATEGORY] = configs.content.deviceTags.category == 'android' ? Conviva.Constants.DeviceCategory.ANDROID : configs.content.deviceTags.category == 'ios' ? Conviva.Constants.DeviceCategory.IOS : Conviva.Constants.DeviceCategory.WEB
  }

  setUpIMA() {
    this.createAdDisplayContainer();
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (e) => { this.onAdsManagerLoaded(e) },
      false);
    adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (e) => { this.onAdError(e) },
      false);

    let contentEndedListener = () => {
      adsLoader.contentComplete();
      this.isContentFinished = true //prevent post-roll to re-play the content
    }
    this._player.onended = contentEndedListener;

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = this._adsURL;
    adsRequest.linearAdSlotWidth = this._player.clientWidth;
    adsRequest.linearAdSlotHeight = this._player.clientHeight;

    adsRequest.nonLinearAdSlotWidth = this._player.clientWidth;
    adsRequest.nonLinearAdSlotHeight = this._player.clientHeight;

    adsLoader.requestAds(adsRequest);
  }


  createAdDisplayContainer() {
    adDisplayContainer = new google.ima.AdDisplayContainer(
      document.getElementById('ad-container'), this._player);
  }

  playAds() {
    this._player.load();
    adDisplayContainer.initialize();

    let width = this._player.clientWidth;
    let height = this._player.clientHeight;

    try {
      adsManager.init(width, height, google.ima.ViewMode.NORMAL);
      adsManager.start();
    } catch (adError) {
      console.log("AdsManager could not be started", adError);
      this._player.play();
    }
  }

  onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Get the ads manager.
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsManager = adsManagerLoadedEvent.getAdsManager(
      this._player, adsRenderingSettings);

    adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (e) => { this.onAdError(e) });
    adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      (e) => { this.onContentPauseRequested(e) });
    adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      (e) => { this.onContentResumeRequested(e) });
    adsManager.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      (e) => { this.onAdEvent(e) });

    adsManager.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      (e) => { this.onAdEvent(e) });
    adsManager.addEventListener(
      google.ima.AdEvent.Type.STARTED,
      (e) => { this.onAdEvent(e) });
    adsManager.addEventListener(
      google.ima.AdEvent.Type.COMPLETE,
      (e) => { this.onAdEvent(e) });
    this.playAds()
  }

  onAdEvent(e) {
    const currentType = google.ima.AdEvent.Type
    switch (e.type) {
      case currentType.STARTED:
        this.isAdsPlaying = true
        if (this.onPlaying) {
          this.onPlaying({ state: 'ADS' })
        }
        break;
      case currentType.AD_BUFFERING:
        this.onBuffering()
        break;
      case currentType.COMPLETE:
        this.isAdsPlaying = false
        break;
      case currentType.AD_PROGRESS:
        let adData = e.getAdData();
        if (this.getBufferLength) {
          this.getBufferLength(adData.currentTime, adData.duration);
        }
        break;
      case currentType.ALL_ADS_COMPLETED:
        this.isAllAdsCompleted = true
        if (this.isContentFinished) {
          this.onFinish()
        }
        break;
      default:
        console.log('onAdEvent')
    }
  }

  onAdError(adErrorEvent) {
    console.log(adErrorEvent.getError());
    adsManager.destroy();
  }

  onContentPauseRequested() {
    this._player.pause();
  }

  onContentResumeRequested() {
    this._player.play();
  }

  play() {
    if (this.isAdsPlaying) {
      adsManager.resume()
      return;
    }
    if (this.isHLS()) {
      import(/* webpackChunkName: "Hls" */ 'hls.js/dist/hls.light').then(({ default: Hls }) => {
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
      });
    } else {
      this.playVideo()
    }
  }

  playVideo() {
    if ((this.isAdsLoaded || !this._withAds) && !this.isContentFinished) {
      this._player.play()
    } else if (this._withAds) {
      this.setUpIMA()
    }
  }

  isHLS() {
    return /.m3u8$/.test(this._src);
  }

  pause() {
    this._player.pause()
    if (this.isAdsPlaying) {
      adsManager.pause()
    }
  }

  volume(v) {
    if (adsManager) {
      if (Object.keys(adsManager).length != 0) {
        adsManager.setVolume(v);
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
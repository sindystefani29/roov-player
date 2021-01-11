let adsManager, _player, _playerConfig, _timeupdateListener, _onFinishListener
let configs = {
  content: {
    //bitrateKbps: 200,
    assetName: 'Roov Player Conviva Application',
    live: false,
    url: "",
    contentLength: 0,
    applicationName: 'Roov Player V3',
    viewerId: "Viewer ID",
    tags: { "aa": "bb" }, // Custom metadata
    CUSTOMER_KEY: "YOUR CONVIVA CUSTOMER KEY",
    gatewayUrl: 'https://rcti.testonly.conviva.com'
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
      this.videoElement = _player;
      this.URL = this._src;
      this.debug = true;
      this.isLive = convivaConfig.isLive;
      this.duration = this.duration();
      this.CUSTOMER_KEY = convivaConfig.CUSTOMER_KEY;

      this.systemSettings = null;
      this.systemInterface = null;
      this.clientSettings = null;
      this.systemFactory = null;
      this.client = null;

      this.contentMetadata = null;
      this.contentSessionKey = null;

      this.contentSessionKey = null;
      this.playerStateManager = null;
      this.html5PlayerInterface = null;

      // Change the configs values for the corresponding stream properties values
      configs.content.live = this.isLive;
      configs.content.url = this.URL;
      configs.content.contentLength = this.duration;
      configs.content.CUSTOMER_KEY = this.CUSTOMER_KEY;
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
      this.initializeIMA();
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
    this.initConvivaClient();
    this.createContentSession();
    // Example of creating a custom tag
    this.createCustomTag("a", "20", false);
    // It is neccessary to call this method to update the metadata on Conviva side
    this.updateContentMetadata();
  }
  // Initializes the Conviva Client
  initConvivaClient() {
    // Encapsulates all Conviva system settings.
    this.systemSettings = new Conviva.SystemSettings();

    if (this.debug) {
      // Show all logs
      this.systemSettings.LogLevel = Conviva.SystemSettings.LogLevel.DEBUG;
    }
    else {
      // Show no logs
      this.systemSettings.LogLevel = Conviva.SystemSettings.LogLevel.NONE;
    }

    // Switch to false during production environment
    this.systemSettings.allowUncaughtExceptions = true;

    // Used by the Conviva library to access system information and utilities.
    this.systemInterface = new Conviva.SystemInterface(
      new Conviva.Impl.Html5Time(),
      new Conviva.Impl.Html5Timer(),
      new Conviva.Impl.Html5Http(),
      new Conviva.Impl.Html5Storage(),
      new Conviva.Impl.Html5Metadata(),
      new Conviva.Impl.Html5Logging()
    );

    this.clientSettings = new Conviva.ClientSettings(configs.content.CUSTOMER_KEY);

    if (configs.content.gatewayUrl != undefined) {
      this.clientSettings.gatewayUrl = configs.content.gatewayUrl;
    }

    // Provides access to system information and utilities according to chosen settings.
    this.systemFactory = new Conviva.SystemFactory(this.systemInterface, this.systemSettings);

    /*
    Main Conviva class.
    Most applications will only need one Client, created during application initialization and released during application shutdown.
    */
    this.client = new Conviva.Client(this.clientSettings, this.systemFactory);

  }
  // Create a Conviva monitoring session.
  createContentSession() {

    this.buildConvivaContentMetadata();

    this.contentSessionKey = this.client.createSession(this.contentMetadata);
    if (this.contentSessionKey === Conviva.Client.NO_SESSION_KEY) {
      //console.log("Error session key couldn't be created");
    }

    this.playerStateManager = this.client.getPlayerStateManager();
    this.html5PlayerInterface = new Conviva.Impl.Html5PlayerInterface(this.playerStateManager, this.videoElement, this.systemFactory);

    this.attachPlayer(this.contentSessionKey, this.playerStateManager);

    this.videoElement.addEventListener('ended', () => {
      // Cleanup Content Session if postroll is not enabled
      this.cleanupContentSession();

    });
  }

  attachPlayer(sessionKey, stateManager) {
    if (this.client != null && sessionKey != Conviva.Client.NO_SESSION_KEY) {
      this.client.attachPlayer(sessionKey, stateManager);
    }
  }

  cleanupContentSession() {

    if (this.contentSessionKey != Conviva.Client.NO_SESSION_KEY) {
      this.html5PlayerInterface.cleanup();
      this.html5PlayerInterface = null;

      this.client.releasePlayerStateManager(this.playerStateManager);
      this.playerStateManager = null;

      this.client.cleanupSession(this.contentSessionKey);
      this.contentSessionKey = Conviva.Client.NO_SESSION_KEY;
    }
    // Release Conviva Client if required during cleanupSession or only during exiting of application
    this.releaseConvivaClient();
  }

  releaseConvivaClient() {
    if (this.client != null) {
      this.client.release();
      this.client = null;
    }

    if (this.systemFactory != null) {
      // If Client was the only consumer of systemFactory, release systemFactory as well.
      this.systemFactory.release();
      this.systemFactory = null;
    }
  }

  // Create a new custom tag, if the tag already exits in the config object depending on the "update" parameter the tag value will be updated or not
  createCustomTag(tag, value, update) {

    if (configs.content.tags[tag] == null && configs.content.tags[tag] == undefined) {
      configs.content.tags[tag] = value;
      //console.log("add tag", configs.content.tags);
    }
    else {
      //console.log("Tag is already created");
      if (update) {
        configs.content.tags[tag] = value;
        //console.log(tag + " value is updated");
      }
    }

    this.buildConvivaContentMetadata();
  }

  // Create the metadata
  buildContentMetadata(credentials) {
    //console.log("metadata", configs.content);
    if (this.contentMetadata != null) {
      if (credentials.assetName != null) {
        this.contentMetadata.assetName = credentials.assetName;
      }
      if (credentials.url != null) {
        this.contentMetadata.streamUrl = credentials.url;
      }
      if (credentials.live != null) {
        this.contentMetadata.streamType = credentials.live ? Conviva.ContentMetadata.StreamType.LIVE : Conviva.ContentMetadata.StreamType.VOD;
      }
      if (credentials.applicationName != null) {
        this.contentMetadata.applicationName = credentials.applicationName;
      }
      if (credentials.viewerId != null) {
        this.contentMetadata.viewerId = credentials.viewerId;
      }
      if (credentials.tags != undefined) {
        Object.assign(this.contentMetadata.custom, credentials.tags);
      }
      if (credentials.contentLength != undefined) {
        this.contentMetadata.duration = credentials.contentLength;
      }

    }
  }

  buildConvivaContentMetadata() {
    this.contentMetadata = new Conviva.ContentMetadata();
    let credentials = configs.content;
    if (credentials != null) {
      //Create metadata
      this.buildContentMetadata(credentials);
    }
  }

  updateContentMetadata() {

    this.buildConvivaContentMetadata();

    if (this.contentSessionKey != null && this.client != null) {
      this.client.updateContentMetadata(this.contentSessionKey, this.contentMetadata);
    }
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

  play() {
    if (this.isAdsPlaying) {
      this._adsManager.resume()
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
    }
  }

  isHLS() {
    return /.m3u8$/.test(this._src);
  }

  pause() {
    this._player.pause()
    if (this.isAdsPlaying) {
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
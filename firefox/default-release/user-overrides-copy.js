/* override recipe: enable session restore ***/
user_pref("browser.startup.page", 3); // 0102
user_pref("privacy.clearOnShutdown.history", false); // 2811

/* override recipe: RFP is not for me ***/
	user_pref("privacy.resistFingerprinting", false); // 4501
	user_pref("privacy.resistFingerprinting.letterboxing", false); // 4504 [pointless if not using RFP]
	user_pref("webgl.disabled", true); // 4520 [mostly pointless if not using RFP
	user_pref("privacy.spoof_english", 2); 
// lear history
	user_pref("privacy.clearHistory.historyFormDataAndDownloads", false); 
	// user_pref("privacy.clearSiteData.historyFormDataAndDownloads", false); 
	user_pref("privacy.clearOnShutdown_v2.historyFormDataAndDownloads", false); 

// recommended for 120hz+ displays
// largely matches Chrome flags: Windows Scrolling Personality and Smooth Scrolling
// from
user_pref("apz.overscroll.enabled", true); // DEFAULT NON-LINUX
user_pref("general.smoothScroll", true); // DEFAULT
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 600);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 650);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2");
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1");
user_pref("mousewheel.default.delta_multiplier_y", 50); // 250-400; adjust this number to your liking
user_pref("mousewheel.default.delta_multiplier_x", 50); // 250-400; adjust this number to your liking

// FASTFOX
user_pref("content.notify.interval", 100000); // (.10s); default=120000 (.12s)
// [NOTE] These prefs will be ignored by DNS resolver if using DoH/TRR.
user_pref("network.dnsCacheExpiration", 3600); // keep entries for 1 hour
// PREF: increase TLS token caching 
user_pref("network.ssl_tokens_cache_capacity", 10240); // default=2048; more TLS token caching (fast reconnects)
user_pref("image.mem.decode_bytes_at_a_time", 32768); // default=16384; alt=65536; chunk size for calls to the image decoders
user_pref("network.http.max-connections", 1800); // default=900
user_pref("network.http.max-persistent-connections-per-server", 10); // default=6; download connections; anything above 10 is excessive
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
user_pref("network.http.pacing.requests.enabled", false);
user_pref("network.dns.disablePrefetchFromHTTPS", true);
user_pref("layout.css.grid-template-masonry-value.enabled", true);
user_pref("dom.enable_web_task_scheduling", true);
user_pref("dom.security.sanitizer.enabled", true);

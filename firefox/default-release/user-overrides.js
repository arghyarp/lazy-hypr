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
user_pref("apz.overscroll.enabled", true); // not DEFAULT on Linux
user_pref("general.smoothScroll", true); // DEFAULT
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 600);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 650);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", 2.0);
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", 1.0);
user_pref("general.smoothScroll.stopDecelerationWeighting", 1.0);
user_pref("mousewheel.default.delta_multiplier_y", 50); // 250-400; adjust this number to your liking
user_pref("mousewheel.default.delta_multiplier_x", 50); // 250-400; adjust this number to your liking

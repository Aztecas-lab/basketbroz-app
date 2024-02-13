package com.aztecas.basketbroz;

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

import org.devio.rn.splashscreen.SplashScreen;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "BasketBroz"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)


  override fun onCreate(savedInstanceState: Bundle?) {
//    androidx.core.splashscreen.SplashScreen.installSplashScreen(this) // native splash screen which will be skipped
    SplashScreen.show(this)
    super.onCreate(null) 
  }
}

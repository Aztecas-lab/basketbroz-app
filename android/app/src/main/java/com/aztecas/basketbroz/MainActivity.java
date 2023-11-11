package com.aztecas.basketbroz;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BasketBroz";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        androidx.core.splashscreen.SplashScreen.installSplashScreen(this); // native splash screen which will be skipped
        SplashScreen.show(this);
        super.onCreate(null);
    }
}

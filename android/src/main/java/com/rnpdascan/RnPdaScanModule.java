package com.rnpdascan;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@ReactModule(name = RnPdaScanModule.NAME)
public class RnPdaScanModule extends ReactContextBaseJavaModule {

  public static final String NAME = "RnPdaScan";

  private final ReactApplicationContext reactContext;
  private static final String PHONEMAX_KNITTO_SCAN_ACTION = "com.phonemax.knitto.scan.broadcast";
  private static final String ZEBRA_KNITTO_SCAN_ACTION = "com.zebra.dwintents.ACTION";

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  private final BroadcastReceiver scanReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      try {
        WritableMap params = Arguments.createMap();
        String actionName = intent.getAction();
        if (PHONEMAX_KNITTO_SCAN_ACTION.equals(actionName)) {
          params.putString("code", intent.getStringExtra("action_scan_barcode"));
        } else if (ZEBRA_KNITTO_SCAN_ACTION.equals(actionName)) {
          params.putString("code", intent.getStringExtra("com.symbol.datawedge.data_string"));
        } else {
          Log.i("RnPdaScanModule", "ActionNotFound");
        }
        sendEvent(getReactApplicationContext(), "onEvent", params);
      } catch (Exception e) {
        WritableMap errorParams = Arguments.createMap();
        errorParams.putString("message", e.getMessage());
        sendEvent(getReactApplicationContext(), "onError", errorParams);
      }
    }
  };

  @ReactMethod
  private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  public RnPdaScanModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    IntentFilter phonemaxIntentFilter = new IntentFilter();
    phonemaxIntentFilter.addAction(PHONEMAX_KNITTO_SCAN_ACTION);
    phonemaxIntentFilter.setPriority(Integer.MAX_VALUE);
    getReactApplicationContext().registerReceiver(scanReceiver, phonemaxIntentFilter);
    IntentFilter zebraIntentFilter = new IntentFilter();
    zebraIntentFilter.addAction(ZEBRA_KNITTO_SCAN_ACTION);
    zebraIntentFilter.setPriority(Integer.MAX_VALUE);
    getReactApplicationContext().registerReceiver(scanReceiver, zebraIntentFilter);
  }
  //   // Example method
  //   // See https://reactnative.dev/docs/native-modules-android
  //   @ReactMethod
  //   public void multiply(double a, double b, Promise promise) {
  //     promise.resolve(a * b);
  //   }
}

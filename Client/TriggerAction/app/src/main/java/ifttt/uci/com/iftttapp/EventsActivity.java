package ifttt.uci.com.iftttapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

public class EventsActivity extends AppCompatActivity {

    String wifiUrl = "https://smart-notification-server.herokuapp.com/sms/";
    String wifiFalse = "{\"wifi\":false}";
    String wifiTrue = "{\"wifi\":true}";
    String TAG = "WifiScanReceiver";
    String details = "";
    int flag=0;
    static EventsActivity instance = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_events);
        //Intent serviceIntent = new Intent(this, WifiLogger.class);
        //startService(serviceIntent);
        BroadcastReceiver receiver;
        // Register Broadcast Receiver
        ConnectivityManager connManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo mWifi = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        WifiManager wifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);

        boolean test = mWifi.isConnected();
        Log.i(TAG, "is wifi connected?" + test);
        // new HTTPAsyncTask().execute(smsUrl, wifiTrue);

        if (mWifi.isConnected()) {
            //if Wifi Connected, check strength
            Log.i(TAG, "WifiConnected");
            int numberOfLevels = 5;
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            int level = WifiManager.calculateSignalLevel(wifiInfo.getRssi(), numberOfLevels);

            Log.i(TAG, "Wifi Strength:" + level);
            if (level < 1) {
                details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"wifi\": false }";
                new HTTPAsyncTask().execute(wifiUrl, details);
                flag = 0;
            } else {
                if (flag == 0) {
                    details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"wifi\": true }";
                    new HTTPAsyncTask().execute(wifiUrl, details);
                    flag = 1;
                }
            }
        } else
        //Turn on Wifi
        {
            if(flag == 1){
                flag = 0;
                details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"wifi\":\""+false+"\"}";
                new HTTPAsyncTask().execute(wifiUrl, details);
            }
            Log.i(TAG, "WifiDIsconnected, turning it on");
            wifiManager.setWifiEnabled(true);

        }
        receiver = new WifiScanReceiver(this);

        registerReceiver(receiver, new IntentFilter(
                WifiManager.SCAN_RESULTS_AVAILABLE_ACTION));
        instance = this;
    }

    public static EventsActivity  getInstance(){
        return instance;
    }
//    public static void updateTheTextView(String event){
//        EventsActivity.this.runOnUiThread(new Runnable() {
//            public void run() {
//                TextView textV1 = (TextView) instance.findViewById(R.id.textV1);
//                textV1.setText(t);
//            }
//        });
//    }


}

package ifttt.uci.com.iftttapp;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

public class WifiLogger extends Service {
    String smsUrl = "http://requestb.in/175yi3g1";
    String wifiFalse = "{\"wifi\":false}";
    String wifiTrue = "{\"wifi\":true}";
    String TAG = "EventsActivity";
    int flag=0;
    public WifiLogger() {
    }
    void logger() {

        while (true) {

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
                    new HTTPAsyncTask().execute(smsUrl, wifiFalse);
                    flag = 0;
                } else {
                    if (flag == 0) {
                        new HTTPAsyncTask().execute(smsUrl, wifiTrue);
                        flag = 1;
                    }
                }
            } else
            //Turn on Wifi
            {
                new HTTPAsyncTask().execute(smsUrl, wifiFalse);
                Log.i(TAG, "WifiDIsconnected, turning it on");
                wifiManager.setWifiEnabled(true);
            }
        }
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        logger();
        // We want this service to continue running until it is explicitly
        // stopped, so return sticky.
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.

        throw new UnsupportedOperationException("Not yet implemented");

    }

}

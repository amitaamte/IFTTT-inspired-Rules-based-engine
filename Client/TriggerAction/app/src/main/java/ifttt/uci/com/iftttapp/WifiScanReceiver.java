package ifttt.uci.com.iftttapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;
import android.widget.Toast;

public class WifiScanReceiver extends BroadcastReceiver {
    String smsUrl = "https://smart-notification-server.herokuapp.com/sms/";
    String wifiFalse = "{\"wifi\":false}";
    String wifiTrue = "{\"wifi\":true}";
    String TAG = "WifiScanReceiver";
    int flag=0;
    int start=0;
    String details = "";
    Context context = null;
    public WifiScanReceiver(Context c) {
        context = c;
    }
    public WifiScanReceiver() {
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO: This method is called when the BroadcastReceiver is receiving
        // an Intent broadcast.
        ConnectivityManager connManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo mWifi = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);

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
                if (flag == 1||start==0) {
                    details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"wifi\": false}";
                    new HTTPAsyncTask().execute(smsUrl, details);
                    flag = 0;
                    start = 1;
                }
            } else {
                if (flag == 0 || start==0) {
                    details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"wifi\": true}";
                    new HTTPAsyncTask().execute(smsUrl, details);
                    flag = 1;
                    start = 1;
                }
            }
        } else

        //Turn on Wifi
        {
            if(flag == 1){
                flag = 0;
                details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"wifi\":\" false}";
                new HTTPAsyncTask().execute(smsUrl, details);
            }
            Log.i(TAG, "WifiDIsconnected, turning it on");
            wifiManager.setWifiEnabled(true);

        }
        Log.d("Debug", "onReceive() message: " + "Wifi changed");
        //throw new UnsupportedOperationException("Not yet implemented");

    }

}

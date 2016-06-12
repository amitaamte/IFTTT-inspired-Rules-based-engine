package ifttt.uci.com.iftttapp;

import android.os.AsyncTask;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Amita Amte on 24-05-2016.
 */
public class HTTPAsyncTask extends AsyncTask<String, Integer, Double> {

    @Override
    protected Double doInBackground(String... params) {
        // TODO Auto-generated method stub
        postData(params[0],params[1]);
        return null;
    }

    protected void onProgressUpdate(Integer... progress){
    }

    public void postData(String url, String value) {
        // Create a new HttpClient and Post Header
        HttpClient httpClient = new DefaultHttpClient();
        Log.e("AsyncTask", value);
        // replace with your url
        HttpPost httpPost = new HttpPost(url);

        //Encoding POST data
        try {
            StringEntity se = new StringEntity(value);
            httpPost.addHeader("Content-Type","application/json");
            httpPost.setEntity(se);
        } catch (Exception e) {
            // log exception
            e.printStackTrace();
        }
        //making POST request.
        try {
            HttpResponse response = httpClient.execute(httpPost);
            // write response to log
            int status = response.getStatusLine().getStatusCode();
            Log.d("Url:", " - "+url);
            Log.d("Http Post Response:", " - "+status);
        } catch (ClientProtocolException e) {
            // Log exception
            e.printStackTrace();
        } catch (IOException e) {
            // Log exception
            e.printStackTrace();
        }
    }

}
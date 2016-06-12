package ifttt.uci.com.iftttapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.IOException;

public class RegisterActivity extends AppCompatActivity{
    private AsyncTask mAuthTask = null;
    private EditText mPhoneNo1 = null;
    private EditText mPhoneNo2 = null;
    private EditText mSensorId = null;
    String registerNumbersUrl = "https://smart-notification-server.herokuapp.com/firstlogin/";
    String details = " ";
    private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
    private static final String TAG = "RegisterActivity";



    private BroadcastReceiver mRegistrationBroadcastReceiver;
    private ProgressBar mRegistrationProgressBar;
    private boolean isReceiverRegistered;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        mPhoneNo1 = (EditText) findViewById(R.id.contact1);
        mPhoneNo2 = (EditText) findViewById(R.id.contact2);
        mSensorId = (EditText) findViewById(R.id.sensorValue);
        Button mRegisterButton = (Button) findViewById(R.id.confirm);
        mRegisterButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptLogin();
            }
        });


    }

    private void attemptLogin() {
        String phone1 = mPhoneNo1.getText().toString();
        String phone2 = mPhoneNo2.getText().toString();
        String sensorId = mSensorId.getText().toString();
        //construct json

        RegisterAsyncTask asyncTask = new RegisterAsyncTask();
        details = "{\"name\": \""+CommonUtilities.NAME+"\",\"token\":\""+CommonUtilities.TOKEN+"\",\"num\":\""+CommonUtilities.PHONE+"\",\"num1\":\""+phone1+"\",\"num2\":\""+phone2+"\",\"sensorID\":"+sensorId+"}";

        asyncTask.execute(registerNumbersUrl,details);


    }
    public class RegisterAsyncTask extends AsyncTask<String, Integer, Double> {

        @Override
        protected Double doInBackground(String... params) {
            // TODO Auto-generated method stub
            postData(params[0],params[1]);
            return null;
        }
        @Override
        protected void onPostExecute(Double result){
            // Change Activity
            Intent intent = new Intent(RegisterActivity.this, ifttt.uci.com.iftttapp.EventsActivity.class);
            startActivity(intent);
        }

        protected void onProgressUpdate(Integer... progress){
        }

        public void postData(String url, String value) {
            HttpClient httpClient = new DefaultHttpClient();
            Log.e("AsyncTask", value);
            HttpPost httpPost = new HttpPost(url);
            try {
                StringEntity se = new StringEntity(value);
                httpPost.addHeader("Content-Type","application/json");
                httpPost.setEntity(se);
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                HttpResponse response = httpClient.execute(httpPost);
                int status = response.getStatusLine().getStatusCode();
                Log.d("Url:", " - "+url);
                Log.d("Http Post Response:", " - "+status);
            } catch (ClientProtocolException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

    }
}

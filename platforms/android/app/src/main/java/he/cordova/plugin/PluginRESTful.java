package apache.cordova.plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import android.content.Context;
import android.os.AsyncTask;

import java.io.File;
import java.io.FileOutputStream;
import java.io.StringWriter;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream.GetField;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * This class echoes a string called from JavaScript.
 */

public class PluginRESTful extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("login")) {
            String url = args.getString(0);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("email",args.getString(1));
            jsonObject.put("password",args.getString(2));
            try {
                this.login(url, jsonObject, callbackContext);
            } catch (Exception e) {
                //TODO: handle exception
                callbackContext.error(e.toString());
            }
            return true;
        }
        if (action.equals("load1")) {
            String url = args.getString(0);
            String token = args.getString(1);
            try {
                this.load(url, token, callbackContext);
            } catch (Exception e) {
                callbackContext.error(e.toString());
                //TODO: handle exception
            }
            
            return true;
        }
        if (action.equals("load")) {
            String url = args.getString(0);
            String token = args.getString(1);
            GetImageURL getImageURL=new GetImageURL(callbackContext);
            getImageURL.execute(url,token);
            return true;
        }
        if (action.equals("delete")) {
            String url = args.getString(0);
            String token = args.getString(1);
            try {
                this.delete(url, token, callbackContext);
            } catch (Exception e) {
                callbackContext.error(e.toString());
                //TODO: handle exception
            }
            
            return true;
        }
        if (action.equals("signup")) {
            String url = args.getString(0);
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("email",args.getString(1));
            jsonObject.put("password",args.getString(2));
            try {
                this.signup(url, jsonObject, callbackContext);
            } catch (Exception e) {
                callbackContext.error(e.toString());
                //TODO: handle exception
            }
            
            return true;
        }
        return false;
    }

    private void login(String url, JSONObject info, CallbackContext callbackContext) throws JSONException, IOException {
        URL server = new URL(url);
        String input = info.toString();
        HttpURLConnection httpURLConnection = (HttpURLConnection) server.openConnection();
        httpURLConnection.setDoOutput(true);
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setRequestProperty("Content-Type", "application/json");

        OutputStream os = httpURLConnection.getOutputStream();
        os.write(input.getBytes());
        os.flush();

        if (httpURLConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new RuntimeException("Failed : HTTP error code : " + httpURLConnection.getResponseCode());
        }
        BufferedReader br = new BufferedReader(new InputStreamReader((httpURLConnection.getInputStream())));
        String output;
        while ((output = br.readLine()) != null) {
            JSONObject jsonObject = new JSONObject(output);
            callbackContext.success(jsonObject);
        }

        httpURLConnection.disconnect();

        return;

    }

    private void load(String url, String token, CallbackContext callbackContext) throws IOException, JSONException {
        URL server = new URL(url);
        HttpURLConnection httpURLConnection = (HttpURLConnection) server.openConnection();
        httpURLConnection.setRequestProperty("Authorization", "bearer " + token);
        httpURLConnection.setRequestMethod("GET");
        httpURLConnection.setRequestProperty("Content-Type", "application/json");
        httpURLConnection.setUseCaches(false);

        if (httpURLConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new RuntimeException("Failed : HTTP error code : " + httpURLConnection.getResponseCode());
        }

        BufferedReader br = new BufferedReader(new InputStreamReader((httpURLConnection.getInputStream())));
        String output;
        JSONArray jsonArray = new JSONArray();
        while ((output = br.readLine()) != null) {
            JSONObject jsonObject = new JSONObject(output);
            jsonArray = jsonObject.getJSONArray("images");
            callbackContext.success(jsonArray);
        }
    }

    private void delete(String url, String token, CallbackContext callbackContext) throws IOException, JSONException {
        URL server = new URL(url);
        HttpURLConnection httpURLConnection = (HttpURLConnection) server.openConnection();
        httpURLConnection.setRequestProperty("Authorization", "bearer " + token);
        httpURLConnection.setRequestMethod("DELETE");
        httpURLConnection.setRequestProperty("Content-Type", "application/json");
        httpURLConnection.setUseCaches(false);

        if (httpURLConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new RuntimeException("Failed : HTTP error code : " + httpURLConnection.getResponseCode());
        }

        BufferedReader br = new BufferedReader(new InputStreamReader((httpURLConnection.getInputStream())));

        String output;
        while ((output = br.readLine()) != null) {
            callbackContext.success(output);
        }
    }

    private void signup(String url, JSONObject info, CallbackContext callbackContext) throws JSONException, IOException {
        URL server = new URL(url);
        String input = info.toString();
        HttpURLConnection httpURLConnection = (HttpURLConnection) server.openConnection();
        httpURLConnection.setDoOutput(true);
        httpURLConnection.setRequestMethod("POST");
        httpURLConnection.setRequestProperty("Content-Type", "application/json");

        OutputStream os = httpURLConnection.getOutputStream();
        os.write(input.getBytes());
        os.flush();

        if (httpURLConnection.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
            throw new RuntimeException("Failed : HTTP error code : " + httpURLConnection.getResponseCode());
        }

        callbackContext.success("OK");
        httpURLConnection.disconnect();
        return;

    }

    private void echo(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            callbackContext.success("Test successful: your message is\n" + message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

    private class GetImageURL extends AsyncTask<String, Integer, JSONArray> {
        CallbackContext cb;
        GetImageURL(CallbackContext cb){
            this.cb=cb;
        }

        public CallbackContext getCb() {
            return cb;
        }

        @Override
        protected JSONArray doInBackground(String... strs) {
            String url= strs[0];
            String token=strs[1];
            JSONArray jsonArray = new JSONArray();
            try{
                URL server = new URL(url);
                HttpURLConnection httpURLConnection = (HttpURLConnection) server.openConnection();
                httpURLConnection.setRequestProperty("Authorization", "bearer " + token);
                httpURLConnection.setRequestMethod("GET");
                httpURLConnection.setRequestProperty("Content-Type", "application/json");
                httpURLConnection.setUseCaches(false);

                if (httpURLConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    throw new RuntimeException("Failed : HTTP error code : " + httpURLConnection.getResponseCode());
                }

                BufferedReader br = new BufferedReader(new InputStreamReader((httpURLConnection.getInputStream())));
                String output;

                while ((output = br.readLine()) != null) {
                    JSONObject jsonObject = new JSONObject(output);
                    jsonArray = jsonObject.getJSONArray("images");
                    
                }

                httpURLConnection.disconnect();

            }
            catch (IOException e) {
                cb.error(e.toString());
            } catch (JSONException e) {
                cb.error(e.toString());
            }
            return jsonArray;
        }

        protected void onProgressUpdate(Integer... progress) {
            
        }

        protected void onPostExecute(JSONArray result) {
            if(result.length()>0) cb.success(result);
            else cb.error("Emty");
        }

    }

}

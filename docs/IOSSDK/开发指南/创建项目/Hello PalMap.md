### Hello PalMap
最后更新时间: 2018年03月08日

##### 1.创建并配置工程，具体方法参见【Android Studio配置】；

##### 2.启动地图引擎
&nbsp;&nbsp;&nbsp;(1) 在使用本SDK时，必须先启动地图引擎,推荐在Application中调用
```
 MapEngine.start(this, "your appKey");
```

##### 3.在布局xml文件中添加地图控件
```
<com.palmap.gl.maps.Palmap
        android:id="@+id/palmap"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
```

##### 4.在项目中使用地图的时候需要注意，需要合理的管理地图生命周期，这非常的重要。

以下示例简述地图生命周期的管理：
```
public class MainActivity extends Activity {
    Palmap mMapView = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState); 
        setContentView(R.layout.activity_main);
        //获取地图控件引用
        mMapView = findViewById(R.id.palmap);
     
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        //在activity执行onDestroy时执行mMapView.onDestroy()，销毁地图
        mMapView.onDestroy();
    }
    @Override
    protected void onResume() {
        super.onResume();
        //在activity执行onResume时执行mMapView.onResume ()，重新绘制加载地图
        mMapView.onResume();
    }
    @Override
    protected void onPause() {
        super.onPause();
        //在activity执行onPause时执行mMapView.onPause ()，暂停地图的绘制
        mMapView.onPause();
    }
    @Override
    public void onLowMemory() {
        super.onLowMemory();
        //在activity执行onLowMemory时执行mMapView.onLowMemory
        mMapView.onLowMemory();
    }
}
```

##### 4.确认地图style配置文件 ==(重要)==

查看工程assets根目录下style.json地图配色文件是否存在
（如果缺少配色，地图将不会加载）

地图配色相关详情请查看地图配色相关章节

##### 5.加载地图
```
mMapView.setOnMapReadyListener(new Palmap.OnMapReadyListener() {
    @Override
    public void onMapReady(MapView mapView) {
        //初次加载地图时，在地图准备之后再加载
        palmap.loadMap("your building id");//填写你需要加载的建筑物id
    }
});
```
<font color="#66666" size="2">完成以上步骤后，运行程序，即可在您的应用中显示地图。</font> 
### Android Studio 配置工程
最后更新时间: 2018年03月08日


##### 新建一个Android工程

使用Android Studio新建一个 Empty Activity 应用项目。

---
##### 1、添加 jar 文件：

将下载的地图SDK的palmapSdk_vX_X_X.jar包复制到工程的 libs 目录下，如果有老版本 jar 包在其中，请删除。

##### 2、拷贝assets文件夹

将下载的assets文件夹内容完整复制到工程的assets目录下。

##### 3、在主工程的build.gradle文件配置dependencies

```
compile fileTree(dir: 'libs', include: ['*.jar'])
compile('com.github.bumptech.glide:glide:4.4.0') {
    exclude group: 'com.android.support'
}
compile 'com.squareup.okhttp3:okhttp:3.9.1'
```

##### 4、工程清单文件配置

&nbsp;&nbsp;&nbsp;(1) 首先添加权限
```
<!--允许程序打开网络套接字-->
<uses-permission android:name="android.permission.INTERNET" />
<!--允许程序设置内置sd卡的写权限-->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />   
```
&nbsp;&nbsp;&nbsp;(2) 设置glEsVersion
```
<uses-feature android:glEsVersion="0x00020000" android:required="true" />
```

##### 5、工程编译无误，既配置成功
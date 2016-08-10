XDocReport Samples
==================

[![Build Status](https://secure.travis-ci.org/opensagres/xdocreport.samples.png)](http://travis-ci.org/opensagres/xdocreport.samples)

## Requirements
1. Add Environment Variable Path = D:\Tools\apache-maven-3.3.9\bin
2. Copy repository C:\Users\serhiy_golodychenko\.m2\repository\fr
3. Copy D:\Projects\Delk\apache-tomcat-8.5.4
4. Install Idea plugin https://plugins.jetbrains.com/files/8266/26081/tomcat.zip 

```bash
$ mvn clean
$ mvn package
```

Copy 'xdocreport-gae-demo.war' to Tomcat webapp folder.
Example url - [localhost url](http://localhost:8080/xdocreport-gae-demo/)
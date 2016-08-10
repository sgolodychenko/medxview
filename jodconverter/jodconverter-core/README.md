JODConverter Core
=================

1. OpenOffice should be installed and service started ([wiki](https://wiki.openoffice.org/wiki/Framework/Article/Command_Line_Arguments), [readme](http://www.artofsolving.com/node/10)):
``` cmd
soffice "-accept=socket,host=0,port=2002;urp;" -nofirststartwizard

# Usefull commands:
soffice -unaccept=all
soffice -headless -accept=socket,host=0,port=2002;urp; -nofirststartwizard
```
2. Download [Hyperic-Sigar](http://kent.dl.sourceforge.net/project/sigar/sigar/1.6/hyperic-sigar-1.6.4.zip) for tests passing.
3. Unzip and add path to Environment Variable - Path (for e.g. - D:\Projects\Delk\sources\medxview\jodconverter\hyperic-sigar-1.6.4\sigar-bin\lib)

```bash
# to skip maven tests:
$ mvn package -Dmaven.test.skip=true
```
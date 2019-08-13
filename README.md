# class-mitosis

[![NPM Version](http://img.shields.io/npm/v/@marketto/class-mitosis.svg?style=flat)](https://www.npmjs.org/package/@marketto/class-mitosis)[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMarketto%2FclassMitosis.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FMarketto%2FclassMitosis?ref=badge_shield)

[![NPM Downloads](https://img.shields.io/npm/dm/@marketto/class-mitosis.svg?style=flat)](https://npmcharts.com/compare/@marketto/class-mitosis?minimal=true)
[![Dependency status](https://david-dm.org/Marketto/classMitosis.svg)](https://david-dm.org/Marketto/classMitosis)
[![Dev dependency status](https://david-dm.org/Marketto/classMitosis/dev-status.svg)](https://david-dm.org/Marketto/classMitosis?type=dev)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=alert_status)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=coverage)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=sqale_rating)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=reliability_rating)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
![Build Status](http://ci.marketto.it/buildStatus/icon?job=mitosis)
[![Blog](https://img.shields.io/badge/blog-marketto-blue.svg)](http://blog.marketto.it)
[![Buy me a coffee](https://img.shields.io/badge/Ko--fi-donate-blueviolet)](https://ko-fi.com/marketto)

Command line tool to automatic copy and rename a folder of js classes


## Installation
```{r, engine='bash', global_install}
npm install @marketto/class-mitosis -g
```

## Getting Started
```{r, engine='bash', run}
mitosis -s source-dir -d destination-dir
```
### Running from source path
```{r, engine='bash', run}
mitosis -d destination-dir
```
### Different source/destination strings to seek/replace
```{r, engine='bash', run}
mitosis -s source-dir -d destination-dir -t target-string -r replacing-string
```

## Info
### Version
```{r, engine='bash', run}
mitosis -v
```
### Help: List of available parameters
```{r, engine='bash', run}
mitosis -h
```



[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMarketto%2FclassMitosis.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FMarketto%2FclassMitosis?ref=badge_large)

## Changelog
### 1.1.1
- Sonar config to exclude docs from coverage
### 1.1.0
- Docs
### 1.0.10
- Fixed replacingString param bind to Mitosis typo
- Added param parsing unit test
### 1.0.9
- Fixed destination parsing error
- Implemented mkDirRecursive
- Improved jsDocs and added jsDoc as dev dependency
### 1.0.8
- Added command line test
- Fixed issue related to creation of destination path
- Standard project folder structure
### 1.0.7
- Fixed MitosisProgram default params
### 1.0.6
- Fixed bugs related to source relative path
- Improved tests
- Added default source path constant
- Tests divided in different files per class
### 1.0.5
- Added replacing of UPPER CASE, KEBAP-CASE, SNAKE_CASE
- Replaced lodash lowercase with native lowercase to prevent - to be replaced with _
### 1.0.4
- Reduced cognitive complexity in Mitosis.fetch
- Added command line test
- Fixed path issue on fetch in copy method
- Removed catch in Mitosis promise to prevent false positive
### 1.0.3
- Readme update
- Reduced cognitive complexity in Mitosis.copy
- Implemented copy promise return type as fetch {files, directories}
- Implemented mocha/chai tests for fetch, replace, ABSOLUTE_PATH_MATCHER, pathFinalDir and multiCaseReplacer
### 1.0.2
- Readme update


## LICENSE
[MIT License](LICENSE)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMarketto%2FclassMitosis.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FMarketto%2FclassMitosis?ref=badge_large)

## AUTHOR
[Marco Ricupero](mailto:marco.ricupero@gmail.com)

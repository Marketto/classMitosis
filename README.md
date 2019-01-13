# class-mitosis

[![NPM Version](http://img.shields.io/npm/v/@marketto/class-mitosis.svg?style=flat)](https://www.npmjs.org/package/@marketto/class-mitosis)
[![NPM Downloads](https://img.shields.io/npm/dm/@marketto/class-mitosis.svg?style=flat)](https://npmcharts.com/compare/@marketto/class-mitosis?minimal=true)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=alert_status)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=coverage)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=sqale_rating)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=Marketto_mitosis&metric=reliability_rating)](https://sonarcloud.io/dashboard/index/Marketto_mitosis)
![Build Status](http://ci.marketto.it/buildStatus/icon?job=mitosis)

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

## Author
**Marco Ricupero** - [Github](https://github.com/Marketto) - [Blog](http://blog.marketto.it)


## License
This project is licensed under the MIT License - see the [License](/LICENSE) file for details


##Changelog
### 1.0.3
- Readme update
- Reduced cognitive complexity in Mitosis.copy
- Implemented copy promise return type as fetch {files, directories}
- Implemented mocha/chai tests for fetch, replace, ABSOLUTE_PATH_MATCHER, pathFinalDir and multiCaseReplacer
### 1.0.2
- Readme update
exports.isDefined = function (variable){
  if(typeof variable === 'undefined' || variable === null){
    return false;
  }
  return true;
}

exports.isEmpty = function (variable){
  if (variable=='' || variable===null){
    return false;
  }
  return true;
}
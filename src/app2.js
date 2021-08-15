console.log('running app2.js');


const getVal = () => {
    const x = {textVal: 'app2.js'};
    const {textVal} = x;
    return textVal;
};

console.log(_.toUpper(getVal()));
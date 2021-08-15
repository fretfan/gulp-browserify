console.log('running app3.js');


const getVal = () => {
    const x = {asdasd: 'app3.js'};
    const temp = {...x};
    const {asdasd} = temp;
    return asdasd;
};

console.log(_.toUpper(getVal()));
let order = false;
const breakfastPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (order){
            resolve('Your order is ready!')
        }else {
            reject(Error('There was a problem with your order...'))
        }
    }, 3000);
});

console.log(breakfastPromise)
breakfastPromise.
then(val => console.log(val)).
catch(error => {console.log(error)})

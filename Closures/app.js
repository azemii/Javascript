//* The outer makeCounter returns the inner function
//* When the inner function is stored in a variable let k = makeCounter()
//* then all the variables inside both functions are stored in memeory
//* Each seperate function call that is stored in a new varaible has it's own local scope.

function makeCounter(name){
    var count = 0;
    return function(){
        count += 1;
        return count + '' + name;
    }
}


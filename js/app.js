//name our angular app
angular.module('firstApp',[])

.controller('mainController',function(){
    
    //bind this to view model
    var vm = this;
    
    //define variables and objects on this
    //this lets them to be available to our views
    
    //define a basec varaible
    vm.message = 'Hey there! come and see how good I look!';
    
    // define the list of items
    vm.computers =[];
    
    vm.addComputer = function(){
        
        //add computer to the list
        vm.computers.push({
           
           name : vm.computerData.name,
           color: vm.computerData.color,
           nerdness: vm.computerData.nerdness
            
        });
        
        //clear the form
        vm.computerData = {};
    };
});


app.controller('FormatController', function($scope){
    
    $scope.loadData = function(){
        $scope.data = [];
        var data = angular.copy($scope.raw);
        var lines = data.split('\n');
        $scope.headers = lines[0].split(',');
        lines.splice(0,1);
        angular.forEach(lines, function(line){
            fields = line.split(',');
            var temp = {};
            for (var i = 0; i < $scope.headers.length; i++){
                temp[$scope.headers[i]] = fields[i];
            }
            $scope.data.push(temp);
        });
        $scope.checkCases();
    };
    
    $scope.unmatched = angular.copy($scope.data);
    
    $scope.checkCases = function(){
        $scope.unmatched = angular.copy($scope.data);
        if ($scope.cases.length === 0){
            return false;
        }
        angular.forEach($scope.cases, function(rcase){
            rcase.matches = [];
            var remove = [];
            if (rcase.rules.length === 0){
                return false;
            }
            angular.forEach($scope.unmatched, function(entry){
               var matched = [];
               angular.forEach(rcase.rules, function(rule){
                   if (rule.value=='*'){
                        if (entry[rule.field] !== ''){
                            matched.push(true);
                        } else {
                            matched.push(false);
                        }                   
                   }else{
                       var val = rule.value == '_' ? '':rule.value;
                        if (entry[rule.field] == val){
                            matched.push(true);
                        } else {
                            matched.push(false);
                        }
                   }
               });
               if (matched.every(Boolean)){
                   rcase.matches.push(entry);
                   remove.push(entry);
               }
            });
            angular.forEach(remove, function(toremove){
                $scope.unmatched.splice($scope.unmatched.indexOf(toremove),1);
            });
        });
        $scope.processOutput();
    };

    $scope.getValues = function(rcase){
        var vals = ['*','_'];
        angular.forEach($scope.data, function(entry){
            if (vals.indexOf(entry[rcase.field]) == -1){
                vals.push(entry[rcase.field]);
            }
        });
        return vals;
    };

    $scope.cases = [
    ];
  
    $scope.addCase = function(){
        $scope.cases.push({
            rules:[],
            output:'',
            matches:[]
        });
    };
    
    $scope.removeCase = function(rcase){
        $scope.cases.splice($scope.cases.indexOf(rcase),1);
        $scope.checkCases();
    }
    
    $scope.cloneCase = function(rcase){
        $scope.cases.push(angular.copy(rcase));
        $scope.checkCases();
    }
    $scope.addRule = function(rcase){
        rcase.rules.push({field:rcase.field, value:rcase.value});
        delete rcase.field;
        delete rcase.value;
        $scope.checkCases();
    };
    
    $scope.removeRule = function(rcase,rule){
        rcase.rules.splice(rcase.rules.indexOf(rule),1);
        $scope.checkCases();
        $scope.processOutput();
    };
    
    $scope.output = "";
    $scope.processOutput = function(){
        $scope.output = '<?xml version="1.0" encoding="UTF-8"?>';
        rx1 = /{{(.*)}}/g; //replace all {{}} variables
        rx2 = /{\[[^\{\}\[\]]*(>\s?<\/)[^\{\}\[\]]*\]}/g; //Remove optional Lines
        rx3 = /({\[|\]})/g; //clean up rest of tags
        angular.forEach($scope.cases, function(rcase){
            angular.forEach(rcase.matches, function(match){
                out = rcase.output;
                while ((results = rx1.exec(out)) !== null){
                    if (results){
                        out = out.replace(results[0],match[results[1]]);
                    }
                }
                for (var k=0;k<3;k++){ //loop 4 times because javascript cannot handle recurive regex
                    while ((results = rx2.exec(out)) !== null){
                        if (results){
                            out = out.replace(results[0],'');
                        }
                    }
                }
                while ((results = rx3.exec(out)) !== null){
                    if (results){
                        out = out.replace(results[0],'');
                    }
                }
                $scope.output += out;
            });
        });
        $scope.output = vkbeautify.xml($scope.output, 4);
    };
    
    $scope.custom = true;
    $scope.toggleCustom = function(){
        $scope.custom = $scope.custom === false ? true: false;
    };
    
    $scope.demo = true;
    $scope.toggleDemo = function(){
        $scope.demo = $scope.demo === false ? true: false;
    };
    
    $scope.totalMatched = function(){
        var total = 0;
        angular.forEach($scope.cases, function(rcase){
            total += rcase.matches.length;
        });
        return total;
    };
    
    $scope.demoOut = "<transaction>\n\
<name>\n\
<firstName>{{First Name}}</firstName>\n\
<lastName>{{Last Name}}</lastName>\n\
</name>\n\
<address>\n\
<address1>{{Address1}}</address1>\n\
{[<address2>{{Address2}}</address2>]}\n\
<city>{{City}}</city>\n\
<state>{{State}}</state>\n\
<postal>{{Zip}}</postal>\n\
<country>{{Country}}</country>\n\
</address>\n\
{[<phone>{[<phoneNumber>{{Phone}}</phoneNumber>]}</phone>]}\n\
</transaction>";
});
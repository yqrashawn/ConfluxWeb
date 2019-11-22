pragma solidity ^0.5.0;

contract Counter {
    uint public count=0;
    event SelfEvent(address indexed sender);

    constructor(uint num) public {
        count = num;
    }

    function inc(uint num) public returns (uint){
        return count += num;
    }

    function self() public {
        emit SelfEvent(msg.sender);
    }
}

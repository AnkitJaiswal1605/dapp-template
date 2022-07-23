// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAppTemplate {

    string public storedData;

    event Update(address sender, string from, string to);

    function set(string memory myText) public {
        string memory oldVal = storedData;
        storedData = myText;
        emit Update(msg.sender, oldVal, storedData);
    }

    function get() public view returns (string memory) {
        return storedData;
    }
}
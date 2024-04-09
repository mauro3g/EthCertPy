// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Certificate
 * @dev Store & retrieve certificates
 */

struct Student {
    uint256 id;
    string name;
    string surname;
    string dni;
}

struct Course {
    string title;
    string description;
    string institution;
    string duration;
    string date;
}

struct CertificateData {
    uint256 id;
    uint256 issuedDate;
    uint256 expireDate;
    string link;
    string hash;
    Student student;
    Course course;
}

contract Certificate {
    CertificateData[] certificates;
    //maps from cerrtificate identificator to certificate array position
    mapping(uint256 => uint256) position;

    constructor() {}

    function getAllCertificates()
        external
        view
        returns (CertificateData[] memory)
    {
        return certificates;
    }

    function addCertificate(
        uint256 _issuedDate,
        uint256 _expireDate,
        string memory _link,
        string memory _hash,
        Student memory _student,
        Course memory _course
    ) external {
        uint256 nextId = certificates.length + 1;
        CertificateData memory newCertificate = CertificateData(
            nextId,
            _issuedDate,
            _expireDate,
            _link,
            _hash,
            _student,
            _course
        );
        certificates.push(newCertificate);
        position[nextId] = certificates.length - 1;
    }

    function getCertificateById(
        uint256 certId
    ) external view returns (CertificateData memory) {
        uint256 certIndex = position[certId];
        return certificates[certIndex];
    }
}

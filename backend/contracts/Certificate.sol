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
    string hashCertificate;
    Student student;
    Course course;
}

contract Certificate {
    CertificateData[] certificates;
    //maps from cerrtificate identificator to certificate array position
    mapping(string => uint256) position;

    constructor() {
        Student memory _student = Student(0,"0","0","0");
        Course memory _course = Course("0","0","0","0","0");
        CertificateData memory newCertificate = CertificateData(
            0,
            0,
            0,
            "0",
            "0",
            _student,
            _course
        );
        certificates.push(newCertificate);
        position["0"] = 0;
    }

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
        uint256 nextId = certificates.length;
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
        position[_hash] = certificates.length - 1;
    }

    function getCertificateById(
        string memory _hash
    ) external view returns (CertificateData memory) {
        uint256 certIndex = position[_hash];
        return certificates[certIndex];
    }
}

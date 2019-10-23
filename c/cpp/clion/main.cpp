//
// Created by wsc on 2019/10/9.
//
#include "iostream"
using namespace std;

float * input(int&);

int main() {
    int num;
    float *data;
    data = input(num);
    if(data){
        for(int i=0; i<num; i++){
            cout << data[i] << " ";
        }
        delete(data);
    }
    return 0;
}

float * input(int& n){
    cout << "input number:";
    cin >> n;

    if(n<=0) return nullptr;
    auto *buf = new float[n];
    for(int i=0; i<n; i++){
        cin >> buf[i];
    }

    return buf;
}
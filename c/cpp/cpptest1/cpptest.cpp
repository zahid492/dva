
#include <iostream>
#include <string>
#include <algorithm>
#include <iterator>
#include <functional>
#include <vector>

using namespace std;

int main() {
    string str1 = "123456789!", str2(str1);
    reverse(str1.begin(), str1.end());
    cout << "str1 reverse:" + str1 << endl;

    copy(str1.begin(), str1.end(), str2.begin());
    sort(str1.begin(), str1.end());
    cout << "str1 sort: " + str1 << endl;
    cout << "str2: " + str2 << endl;

    reverse_copy(str1.begin(), str1.end(), str2.begin());
    cout << "str1 reverse_copy: " + str1 << endl;
    cout << "str2 is reverse str1 copy: " + str2 << endl;

    reverse(str2.begin() + 2, str2.begin() + 8);
    cout << " str2: " + str2 << endl;
    copy(str2.begin() + 2, str2.begin() + 8, ostream_iterator<char>(cout));
    cout << " str2: " + str2 << endl;
    cout << endl;

    sort(str1.begin(), str1.end(), std::greater<char>());
    cout << str1 << endl;

    str1.swap(str2);
    cout << str1 << " " << str2;

    cout << endl;
	vector<char>::iterator result1;
    find(str1.begin(), str1.end(), '2');

    return 0;
}



#include <iostream>
#include <string>
#include <algorithm>
#include <iterator> 
#include <functional>

using namespace std;


int main()
{
	string str1 = "wearehere!", str2(str1);
	reverse(str1.begin(), str1.end());
	cout << str1 << endl;

	copy(str1.begin(), str1.end(), str2.begin());
	sort(str1.begin(), str1.end());
	cout << str1 << endl;
	cout << "str2: " + str2 << endl;

	reverse_copy(str1.begin(), str1.end(), str2.begin());
	cout << str1 << endl;
	cout <<  "str2: " + str2 << endl;

	reverse(str2.begin()+2, str2.begin()+8);
	cout <<  " str2: " + str2 << endl;
	copy(str2.begin()+2, str2.begin()+8,ostream_iterator<char>(cout));
	cout <<  " str2: " + str2 << endl;


	

	cout << endl;
	return 0;
}


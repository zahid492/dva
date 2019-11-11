cmake_minimum_required(VERSION 3.13)
project(cpptest1)

set(CMAKE_CXX_STANDARD 14)

include_directories(.)

add_executable(cpptest1
        cpptest.cpp)

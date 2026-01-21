cmake_minimum_required(VERSION 3.10.0)
project(arpg VERSION 0.1.0 LANGUAGES C CXX)

find_path(RL_INCLUDE_DIR NAMES raylib.h PATHS /opt/homebrew/Cellar/raylib/5.5/include REQUIRED)
find_library(RL_LIBRARY NAMES raylib PATHS /opt/homebrew/Cellar/raylib/5.5/lib REQUIRED)

set(SRC_DIR "${CMAKE_CURRENT_SOURCE_DIR}/src")

file(GLOB_RECURSE ARPG_SOURCES CONFIGURE_DEPENDS
	"${SRC_DIR}/**/*.cpp"
	"${SRC_DIR}/**/*.c"
)

# Headers aren't compiled, but listing them helps IDEs show them under the target.
file(GLOB_RECURSE ARPG_HEADERS CONFIGURE_DEPENDS
	"${SRC_DIR}/**/*.h"
	"${SRC_DIR}/**/*.hpp"
)

add_executable(arpg src/main.cpp ${ARPG_SOURCES} ${ARPG_HEADERS})

target_include_directories(arpg PRIVATE ${RL_INCLUDE_DIR})
target_link_libraries(arpg PRIVATE ${RL_LIBRARY})

enable_testing()

add_executable(arpg_tests
	tests/hexgrid_hex_tests.cpp
)

target_include_directories(arpg_tests PRIVATE ${RL_INCLUDE_DIR} ${SRC_DIR})

add_test(NAME arpg_tests COMMAND arpg_tests)

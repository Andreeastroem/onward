#pragma once

#include <raylib.h>

class Tile
{
public:
    Tile(int q, int r, int s);

    void render();

private:
    int m_q;
    int m_r;
    int m_s;

    Color m_color;
};
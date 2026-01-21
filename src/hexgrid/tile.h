#pragma once
#include "hex.h"
#include <raylib.h>

class Tile
{
public:
    Tile(int q, int r, int s);
    Tile(Hex hex);
    Tile(Hex, Color color);

    void render();

    bool atHex(Hex hex);

private:
    Hex coordinates;

    Color m_color;
};
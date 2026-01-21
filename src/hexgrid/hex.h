#pragma once

#include <cmath>
#include <raylib.h>

const static unsigned int HEXSIZE = 64;

struct Hex
{
    int q;
    int r;
    int s;
    bool operator==(Hex hex)
    {
        if (q != hex.q)
            return false;
        if (r != hex.r)
            return false;
        if (s != hex.s)
            return false;
        return true;
    }
};

struct FractionalHex
{
    float q;
    float r;
    float s;
};

static const Hex cubeRound(FractionalHex frac);
static const Hex cubeToAxial(Hex cube);

static const Vector2 hexToPixel(Hex h)
{
    // Pointy-top axial coordinates (q, r)
    const float x = HEXSIZE * (3.0f / 2.0f * static_cast<float>(h.q));
    const float y = HEXSIZE * (std::sqrt(3.0f) * (static_cast<float>(h.r) + static_cast<float>(h.q) / 2.0f));

    return Vector2{x, y};
}

static const Hex pixelToHex(Vector2 pixel)
{
    const float x = pixel.x / static_cast<float>(HEXSIZE);
    const float y = pixel.y / static_cast<float>(HEXSIZE);

    const float q = (2.0f / 3.0f) * x;
    const float r = (-1.0f / 3.0f) * x + (std::sqrt(3.0f) / 3.0f) * y;

    const FractionalHex frac{q, r, -q - r};
    const Hex cube = cubeRound(frac);
    return cubeToAxial(cube);
}

static const Hex cubeRound(FractionalHex frac)
{
    int q = static_cast<int>(std::round(frac.q));
    int r = static_cast<int>(std::round(frac.r));
    int s = static_cast<int>(std::round(frac.s));

    const float qDiff = std::fabs(static_cast<float>(q) - frac.q);
    const float rDiff = std::fabs(static_cast<float>(r) - frac.r);
    const float sDiff = std::fabs(static_cast<float>(s) - frac.s);

    if (qDiff > rDiff && qDiff > sDiff)
        q = -r - s;
    else if (rDiff > sDiff)
        r = -q - s;
    else
        s = -q - r;

    return Hex{q, r, s};
}

static const Hex cubeToAxial(Hex cube)
{
    int q = cube.q;
    int r = cube.r;
    int s = -q - r;

    return Hex{q, r, s};
}

static const Hex axialToCube(Hex hex)
{
    int q = hex.q;
    int r = hex.r;
    int s = -q - r;

    return Hex{q, r, s};
}
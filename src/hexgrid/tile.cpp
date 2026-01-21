#include "tile.h"

#include <printf.h>

#include <rlgl.h>

Tile::Tile(int q, int r, int s)
{
    m_color = DARKGREEN;
    coordinates = Hex{q, r, s};
}

Tile::Tile(Hex hex)
{
    coordinates = hex;
}

Tile::Tile(Hex hex, Color color)
{
    coordinates = hex;
    m_color = color;
}

void Tile::render()
{
    // TODO: calc center
    Vector2 center = hexToPixel(coordinates);
    printf("center x: %f, y: %f", center.x, center.y);

    DrawPoly(center, 6, HEXSIZE, 0, m_color);
}

bool Tile::atHex(Hex hex)
{
    return coordinates == hex;
}

// Draw textured polygon, defined by vertex and texture coordinates
// NOTE: Polygon center must have straight line path to all points
// without crossing perimeter, points must be in anticlockwise order
static void DrawTexturePolyLocal(Texture2D texture, Vector2 center, Vector2 *points, Vector2 *texcoords, int pointCount, Color tint)
{
    rlSetTexture(texture.id);
    rlBegin(RL_TRIANGLES);

    rlColor4ub(tint.r, tint.g, tint.b, tint.a);

    for (int i = 0; i < pointCount - 1; i++)
    {
        rlTexCoord2f(0.5f, 0.5f);
        rlVertex2f(center.x, center.y);

        rlTexCoord2f(texcoords[i].x, texcoords[i].y);
        rlVertex2f(points[i].x + center.x, points[i].y + center.y);

        rlTexCoord2f(texcoords[i + 1].x, texcoords[i + 1].y);
        rlVertex2f(points[i + 1].x + center.x, points[i + 1].y + center.y);
    }
    rlEnd();

    rlSetTexture(0);
}
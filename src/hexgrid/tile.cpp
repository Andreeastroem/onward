#include "tile.h"

#include <rlgl.h>

Tile::Tile(int q, int r, int s)
{
    m_color = DARKGREEN;
    m_q = q;
    m_r = r;
    m_s = s;
}

void Tile::render()
{
    // TODO: calc center
    Vector2 center{100.f, 100.f};
    DrawPoly(center, 6, 64, 0, m_color);
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
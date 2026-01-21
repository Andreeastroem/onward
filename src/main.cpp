#include <iostream>
#include <raylib.h>
#include "resource_dir.h"

#include "hexgrid/tile.h"

#include <vector>
#include "hexgrid/hex.h"

bool hasHexAlready(Hex hex, std::vector<Tile> tiles)
{
    for (unsigned int i = 0; i < tiles.size(); ++i)
    {
        if (tiles.at(i).atHex(hex))
        {
            return true;
        }
    }
    return false;
}

int main()
{
    const int screenWidth = 1920;
    const int screenHeight = 1080;

    SetConfigFlags(FLAG_VSYNC_HINT | FLAG_WINDOW_HIGHDPI | FLAG_WINDOW_RESIZABLE);
    InitWindow(screenWidth, screenHeight, "arpg");
    SearchAndSetResourceDir("resources");

    SetTargetFPS(60); // Set our game to run at 60 frames-per-second
    //--------------------------------------------------------------------------------------

    std::vector<Tile> tiles{};

    // Main game loop
    while (!WindowShouldClose()) // Detect window close button or ESC key
    {
        // Listen to mouse events
        if (IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
        {
            Hex coordinates = pixelToHex(GetMousePosition());
            if (!hasHexAlready(coordinates, tiles))
                tiles.push_back(Tile(coordinates.q, coordinates.r, coordinates.s));
        }

        // Draw
        //----------------------------------------------------------------------------------
        BeginDrawing();
        ClearBackground(BLACK);

        const std::string numberOfTiles = std::to_string(tiles.size());
        DrawText(numberOfTiles.c_str(), 100, 100, 16, WHITE);

        for (unsigned int i = 0; i < tiles.size(); ++i)
        {
            tiles.at(i).render();
        }

        EndDrawing();
        //----------------------------------------------------------------------------------
    }

    // De-Initialization
    //--------------------------------------------------------------------------------------
    CloseWindow(); // Close window and OpenGL context
    //--------------------------------------------------------------------------------------

    return 0;
}
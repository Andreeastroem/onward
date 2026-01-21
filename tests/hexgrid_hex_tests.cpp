#include <cmath>
#include <cstdio>
#include <cstdlib>

#include <raylib.h>

#include "hexgrid/hex.h"

static void fail(const char *message)
{
    std::fprintf(stderr, "TEST FAIL: %s\n", message);
    std::exit(1);
}

static void expectNear(float a, float b, float eps, const char *message)
{
    if (std::fabs(a - b) > eps)
    {
        std::fprintf(stderr, "TEST FAIL: %s (a=%f, b=%f, eps=%f)\n", message, a, b, eps);
        std::exit(1);
    }
}

static void expectHexEq(Hex a, Hex b, const char *message)
{
    if (a.q != b.q || a.r != b.r || a.s != b.s)
    {
        std::fprintf(
            stderr,
            "TEST FAIL: %s (a={%d,%d,%d}, b={%d,%d,%d})\n",
            message,
            a.q,
            a.r,
            a.s,
            b.q,
            b.r,
            b.s);
        std::exit(1);
    }
}

static void test_axial_cube_roundtrip()
{
    const Hex axial{2, -3, 0};
    const Hex cube = axialToCube(axial);
    expectHexEq(cube, Hex{2, -3, 1}, "axialToCube computes s=-q-r");

    const Hex axial2 = cubeToAxial(cube);
    expectHexEq(axial2, Hex{2, -3, 1}, "cubeToAxial preserves q,r and enforces s=-q-r");
}

static void test_hexToPixel_known_points()
{
    {
        const Vector2 p = hexToPixel(Hex{0, 0, 0});
        expectNear(p.x, 0.0f, 1e-5f, "hexToPixel origin x");
        expectNear(p.y, 0.0f, 1e-5f, "hexToPixel origin y");
    }

    {
        const Vector2 p = hexToPixel(Hex{1, 0, 0});
        const float expectedX = static_cast<float>(HEXSIZE) * 1.5f;
        const float expectedY = static_cast<float>(HEXSIZE) * (std::sqrt(3.0f) * 0.5f);
        expectNear(p.x, expectedX, 1e-4f, "hexToPixel (1,0) x");
        expectNear(p.y, expectedY, 1e-4f, "hexToPixel (1,0) y");
    }

    {
        const Vector2 p = hexToPixel(Hex{0, 1, 0});
        const float expectedX = 0.0f;
        const float expectedY = static_cast<float>(HEXSIZE) * std::sqrt(3.0f);
        expectNear(p.x, expectedX, 1e-4f, "hexToPixel (0,1) x");
        expectNear(p.y, expectedY, 1e-4f, "hexToPixel (0,1) y");
    }
}

static void test_pixelToHex_inverse_on_centers()
{
    const Hex samples[] = {
        Hex{0, 0, 0},
        Hex{1, 0, 0},
        Hex{0, 1, 0},
        Hex{-1, 2, 0},
        Hex{3, -2, 0},
        Hex{-4, -1, 0},
    };

    for (const Hex axial : samples)
    {
        const Hex cube = axialToCube(axial);
        const Hex normalizedAxial = cubeToAxial(cube);

        const Vector2 p = hexToPixel(normalizedAxial);
        const Hex back = pixelToHex(p);

        expectHexEq(back, normalizedAxial, "pixelToHex(hexToPixel(h)) == h for hex centers");
    }
}

static void test_pixelToHex_stability_with_small_offsets()
{
    const Hex h = cubeToAxial(axialToCube(Hex{2, -1, 0}));
    const Vector2 center = hexToPixel(h);

    // Small jitter around the center should still map to the same hex.
    const float jitter = static_cast<float>(HEXSIZE) * 0.05f;

    const Vector2 offsets[] = {
        Vector2{jitter, 0.0f},
        Vector2{-jitter, 0.0f},
        Vector2{0.0f, jitter},
        Vector2{0.0f, -jitter},
        Vector2{jitter, -jitter},
    };

    for (const Vector2 o : offsets)
    {
        const Vector2 p{center.x + o.x, center.y + o.y};
        const Hex back = pixelToHex(p);
        expectHexEq(back, h, "pixelToHex stable under small offsets");
    }
}

static void test_cubeRound_examples()
{
    {
        const FractionalHex f{0.0f, 0.0f, 0.0f};
        const Hex rounded = cubeRound(f);
        expectHexEq(rounded, Hex{0, 0, 0}, "cubeRound origin");
    }

    {
        // Close to (1, -1, 0)
        const FractionalHex f{0.98f, -1.01f, 0.03f};
        const Hex rounded = cubeRound(f);
        expectHexEq(rounded, Hex{1, -1, 0}, "cubeRound near (1,-1,0)");
    }

    {
        // Values that don't perfectly sum to 0; cubeRound should enforce q+r+s==0
        const FractionalHex f{2.2f, -0.9f, -1.0f};
        const Hex rounded = cubeRound(f);
        if (rounded.q + rounded.r + rounded.s != 0)
            fail("cubeRound enforces q+r+s==0");
    }
}

int main()
{
    test_axial_cube_roundtrip();
    test_hexToPixel_known_points();
    test_pixelToHex_inverse_on_centers();
    test_pixelToHex_stability_with_small_offsets();
    test_cubeRound_examples();

    std::printf("All tests passed.\n");
    return 0;
}
